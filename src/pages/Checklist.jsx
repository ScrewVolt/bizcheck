import { useState } from 'react'
import { Link } from 'react-router-dom'
import rules from '../data/rules.json'
import holidays from '../data/holidays.json'
import { matchRules } from '../lib/matchRules.js'
import { getUpcomingDeadlines, daysUntil, deadlinesBeyondHolidays } from '../lib/dueDates.js'
import { makeIcs, downloadIcs } from '../lib/makeIcs.js'
import { loadProfile, loadDoneIds, saveDoneIds, loadFiledPeriods, saveFiledPeriods } from '../lib/storage.js'
import Calculator from '../components/Calculator.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useLanguage } from '../lib/LanguageContext.jsx'
import { pick } from '../lib/localize.js'

const tagClass = 'rounded-md px-2.5 py-0.5 text-sm font-semibold'
const linkClass = 'text-accent underline underline-offset-2'
const PORTAL_URL = 'https://www.tax.newmexico.gov/online-services'

// Today in the user's own calendar. This is the one place local time is right:
// "today" should match the date where the user lives.
function localToday() {
  const now = new Date()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

// "2026-10-26" becomes "Monday, October 26, 2026" (or the Spanish version). timeZone UTC matches how the date was built.
function formatDate(dateString, lang) {
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Wording for the banner above the deadline list.
function dueMessage(days, t) {
  if (days === 0) return t('dueToday')
  if (days === 1) return t('dueTomorrow')
  return t('dueInDays', { days })
}

function isRealDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function RuleItem({ rule, done, onToggle }) {
  const { lang, t } = useLanguage()
  return (
    <li className="break-inside-avoid rounded-xl bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={done ? `${tagClass} bg-done-bg text-done-ink` : `${tagClass} bg-todo-bg text-todo-ink`}>
          {done ? t('statusDone') : t('statusTodo')}
        </span>
        {rule.status === 'needs_check' && (
          <span className={`${tagClass} border border-ink bg-white`}>{t('statusNeedsCheck')}</span>
        )}
      </div>

      <h3 className="mt-2 text-lg font-bold">{pick(rule, 'title', lang)}</h3>
      <p className="mt-1">{pick(rule, 'explanation', lang)}</p>
      <p className="mt-2 text-sm">
        <span className="font-medium">{t('whyOnList')}</span> {pick(rule, 'why_applies', lang)}
      </p>
      <p className="mt-1 text-sm">
        <span className="font-medium">{t('agency')}</span> {pick(rule, 'agency', lang)}
      </p>
      <p className="mt-1 text-sm">
        <span className="font-medium">{t('source')}</span>{' '}
        {rule.source_url ? (
          <a href={rule.source_url} target="_blank" rel="noreferrer" className={linkClass}>
            {new URL(rule.source_url).hostname}
          </a>
        ) : (
          t('noSource')
        )}
        {rule.source_url && lang === 'es' && ` ${t('sourceEnglishOnly')}`}
      </p>
      <p className="mt-1 text-sm">
        <span className="font-medium">{t('lastVerified')}</span>{' '}
        {isRealDate(rule.last_verified) ? formatDate(rule.last_verified, lang) : t('notChecked')}
      </p>

      <label className="mt-3 flex min-h-11 items-center gap-3 print:hidden">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(rule.id)}
          className="size-5 accent-accent"
        />
        {t('markDone')}
      </label>
    </li>
  )
}

function Checklist() {
  const { lang, t } = useLanguage()
  // Read once when the page opens. The intake form saved this before navigating here.
  const [profile] = useState(loadProfile)
  const [doneIds, setDoneIds] = useState(loadDoneIds)
  const [filedPeriods, setFiledPeriods] = useState(loadFiledPeriods)

  function toggleFiled(periodEnd) {
    const next = filedPeriods.includes(periodEnd)
      ? filedPeriods.filter((x) => x !== periodEnd)
      : [...filedPeriods, periodEnd]
    setFiledPeriods(next)
    saveFiledPeriods(next)
  }

  function toggleDone(id) {
    const next = doneIds.includes(id) ? doneIds.filter((x) => x !== id) : [...doneIds, id]
    setDoneIds(next)
    saveDoneIds(next)
  }

  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <h1 className="text-2xl font-bold">{t('checklistTitle')}</h1>
        <p className="mt-2">
          {t('noAnswers')}{' '}
          <Link to="/" className={linkClass}>{t('answerQuestions')}</Link> {t('toBuild')}
        </p>
      </main>
    )
  }

  const matched = matchRules(profile, rules)
  const doneCount = matched.filter((rule) => doneIds.includes(rule.id)).length
  const today = localToday()
  const deadlines = getUpcomingDeadlines(profile.filingFrequency, today, holidays.dates)
  // The first deadline not yet marked as filed drives the banner.
  const nextOpen = deadlines.find((d) => !filedPeriods.includes(d.periodEnd))
  const holidayGaps = deadlinesBeyondHolidays(deadlines, holidays.dates)

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-8 md:px-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('checklistTitle')}</h1>
            <p className="mt-1 text-muted">{t('guidanceOnly')}</p>
            <p className="mt-1">
              <Link to="/" className={linkClass}>{t('changeAnswers')}</Link>
            </p>
          </div>
          <div className="min-w-48">
            <p className="text-sm text-muted">{t('progress')}</p>
            <p className="text-xl font-bold">{t('tasksDone', { done: doneCount, total: matched.length })}</p>
            <div
              role="progressbar"
              aria-label={t('progress')}
              aria-valuemin={0}
              aria-valuemax={matched.length}
              aria-valuenow={doneCount}
              className="mt-1.5 h-2 w-full rounded-sm bg-line"
            >
              <div
                className="h-2 rounded-sm bg-accent"
                style={{ width: `${matched.length ? (doneCount / matched.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {deadlines.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-5 rounded-xl bg-warn p-5 text-warn-ink">
            <div className="min-w-60 flex-1">
              <p className="text-sm font-bold uppercase tracking-wide">{t('nextDeadlineLabel')}</p>
              {nextOpen ? (
                <p className="mt-1 text-xl font-bold">
                  {dueMessage(daysUntil(today, nextOpen.dueDate), t)}: {formatDate(nextOpen.dueDate, lang)}
                </p>
              ) : (
                <p className="mt-1 text-xl font-bold">{t('allFiled')}</p>
              )}
            </div>
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-bold text-white focus:outline-2 focus:outline-offset-2 focus:outline-ink print:hidden"
            >
              {t('openPortal')}
              <span className="sr-only"> {t('portalEnglish')}</span>
            </a>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section id="tasks" className="min-w-0">
            <h2 className="text-xl font-bold">{t('tasksHeading')}</h2>
            <ul className="mt-3 space-y-4">
              {matched.map((rule) => (
                <RuleItem key={rule.id} rule={rule} done={doneIds.includes(rule.id)} onToggle={toggleDone} />
              ))}
            </ul>
          </section>

          <div className="flex min-w-0 flex-col gap-6">
            <section id="deadlines" className="rounded-xl bg-white p-5">
              <h2 className="text-xl font-bold">{t('deadlinesHeading')}</h2>
              {deadlines.length === 0 ? (
                <p className="mt-2">
                  {t('needSchedule')}{' '}
                  <Link to="/" className={linkClass}>{t('chooseOnQuestions')}</Link>.
                </p>
              ) : (
                <>
                  <p className="mt-2 text-sm">
                    {t('grtIntro', { frequency: t(`freq_${profile.filingFrequency}`) })}
                  </p>
                  {holidayGaps.length > 0 && <p className="mt-2 text-sm text-muted">{t('holidayGap')}</p>}
                  <ol className="mt-3 divide-y divide-line border-t border-line">
                    {deadlines.map((d) => (
                      <li key={d.periodEnd} className="break-inside-avoid py-3">
                        <p className="font-bold">{t('due', { date: formatDate(d.dueDate, lang) })}</p>
                        <p className="text-sm text-muted">{t('periodEnding', { date: formatDate(d.periodEnd, lang) })}</p>
                        {filedPeriods.includes(d.periodEnd) && (
                          <p className="mt-1 text-sm font-semibold">{t('markedFiled')}</p>
                        )}
                        <label className="mt-1 flex min-h-11 items-center gap-3 print:hidden">
                          <input
                            type="checkbox"
                            checked={filedPeriods.includes(d.periodEnd)}
                            onChange={() => toggleFiled(d.periodEnd)}
                            className="size-5 accent-accent"
                          />
                          {t('markFiled')}
                        </label>
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    onClick={() => downloadIcs(makeIcs(deadlines, new Date(), lang))}
                    className="mt-3 min-h-12 w-full rounded-md bg-accent px-5 font-bold text-white hover:bg-ink focus:outline-2 focus:outline-offset-2 focus:outline-accent print:hidden"
                  >
                    {t('downloadCalendar')}
                  </button>
                  <p className="mt-2 text-sm text-muted print:hidden">{t('calendarNote')}</p>
                </>
              )}
            </section>

            <Calculator />

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-12 rounded-md border border-accent bg-white px-5 font-bold text-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent print:hidden"
            >
              {t('print')}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checklist
