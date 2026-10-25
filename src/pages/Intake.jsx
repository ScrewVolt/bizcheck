import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadProfile, saveProfile } from '../lib/storage.js'
import { useLanguage } from '../lib/LanguageContext.jsx'

const EMPTY_PROFILE = { city: '', hasEmployees: null, filingFrequency: '' }

// One question per step. done() says whether the step has an answer, so Next stays off until it does.
const STEPS = [
  { id: 'city', done: (p) => p.city !== '' },
  { id: 'employees', done: (p) => p.hasEmployees !== null },
  { id: 'frequency', done: (p) => p.filingFrequency !== '' },
]

const selectClass =
  'mt-1 block min-h-11 w-full rounded-md border border-muted bg-white px-3 focus:outline-2 focus:outline-accent'
const radioRowClass = 'flex min-h-11 items-center gap-3'

function Intake() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  // Start from saved answers so a returning user sees what they picked last time.
  // Spreading over EMPTY_PROFILE fills in any field an older saved profile is missing.
  const [profile, setProfile] = useState(() => ({ ...EMPTY_PROFILE, ...loadProfile() }))
  const [step, setStep] = useState(0)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function update(field, value) {
    setProfile({ ...profile, [field]: value })
  }

  // The form's submit runs for the Next button and for the Enter key.
  function handleSubmit(event) {
    event.preventDefault()
    if (!current.done(profile)) return
    if (isLast) {
      saveProfile(profile)
      navigate('/checklist')
    } else {
      setStep(step + 1)
    }
  }

  // The text shown in "Answered so far" for each finished step.
  function answerText(id) {
    if (id === 'city') return profile.city === 'alamogordo' ? t('cityAlamogordo') : t('cityOther')
    if (id === 'employees') return profile.hasEmployees ? t('yes') : t('no')
    return t(profile.filingFrequency)
  }
  const answerLabels = { city: t('ansCity'), employees: t('ansEmployees'), frequency: t('ansFrequency') }
  const whyText = { city: t('whyCity'), employees: t('whyEmployees'), frequency: t('whyFrequency') }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-8 md:px-9">
      <p className="text-sm font-semibold text-muted">{t('stepOf', { n: step + 1, total: STEPS.length })}</p>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {STEPS.map((s, index) => (
          <div key={s.id} className={`h-2 flex-1 rounded-sm ${index <= step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_270px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl bg-white p-6 md:p-8">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <label htmlFor="city">{t('cityLabel')}</label>
              </h1>
              <select
                id="city"
                value={profile.city}
                onChange={(e) => update('city', e.target.value)}
                className={selectClass}
              >
                <option value="">{t('chooseOne')}</option>
                <option value="alamogordo">{t('cityAlamogordo')}</option>
                <option value="other">{t('cityOther')}</option>
              </select>
            </div>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="text-2xl font-bold tracking-tight">{t('employeesLegend')}</legend>
              <label className={radioRowClass}>
                <input
                  type="radio"
                  name="hasEmployees"
                  checked={profile.hasEmployees === true}
                  onChange={() => update('hasEmployees', true)}
                  className="size-5 accent-accent"
                />
                {t('yes')}
              </label>
              <label className={radioRowClass}>
                <input
                  type="radio"
                  name="hasEmployees"
                  checked={profile.hasEmployees === false}
                  onChange={() => update('hasEmployees', false)}
                  className="size-5 accent-accent"
                />
                {t('no')}
              </label>
            </fieldset>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <label htmlFor="filingFrequency">{t('frequencyLabel')}</label>
              </h1>
              <p id="filingFrequencyHint" className="mt-2 text-muted">{t('frequencyHint')}</p>
              <select
                id="filingFrequency"
                aria-describedby="filingFrequencyHint"
                value={profile.filingFrequency}
                onChange={(e) => update('filingFrequency', e.target.value)}
                className={selectClass}
              >
                <option value="">{t('chooseOne')}</option>
                <option value="monthly">{t('monthly')}</option>
                <option value="quarterly">{t('quarterly')}</option>
                <option value="semiannual">{t('semiannual')}</option>
                <option value="unknown">{t('unknown')}</option>
              </select>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="min-h-12 rounded-md border border-muted bg-white px-5 font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-accent"
              >
                {t('back')}
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={!current.done(profile)}
              className="min-h-12 rounded-md bg-accent px-7 font-bold text-white hover:bg-ink focus:outline-2 focus:outline-offset-2 focus:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLast ? t('submit') : t('next')}
            </button>
          </div>
        </form>

        <aside className="flex flex-col gap-4">
          <section className="rounded-xl bg-why p-5">
            <h2 className="font-bold text-done-ink">{t('whyHeading')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{whyText[current.id]}</p>
          </section>
          <section className="rounded-xl bg-white p-5">
            <h2 className="font-bold">{t('answeredSoFar')}</h2>
            <ol className="mt-2 space-y-1 text-sm leading-relaxed">
              {STEPS.slice(0, step).map((s) => (
                <li key={s.id}>
                  {answerLabels[s.id]}: {answerText(s.id)}
                </li>
              ))}
            </ol>
          </section>
          <p className="text-sm leading-relaxed text-muted">{t('whyBody2')}</p>
        </aside>
      </div>
    </main>
  )
}

export default Intake
