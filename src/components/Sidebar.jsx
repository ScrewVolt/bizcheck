import { useLanguage } from '../lib/LanguageContext.jsx'

const linkClass =
  'block min-h-11 rounded-md px-3.5 py-3 text-[15px] hover:bg-sidebar-active focus:outline-2 focus:outline-offset-2 focus:outline-white'

// Dark navigation column from the mockup. It only shows on wide screens and never prints.
// The links jump to sections on the same page, so they are plain <a href="#..."> links.
function Sidebar() {
  const { t } = useLanguage()
  return (
    <nav
      aria-label="Checklist"
      className="hidden w-60 flex-none flex-col gap-1.5 bg-sidebar px-5 py-7 text-[#e3eee9] md:flex print:hidden"
    >
      <a href="#tasks" className={`${linkClass} bg-sidebar-active font-semibold text-white`}>{t('navChecklist')}</a>
      <a href="#deadlines" className={linkClass}>{t('navDeadlines')}</a>
      <a href="#estimate" className={linkClass}>{t('navEstimate')}</a>
      <button type="button" onClick={() => window.print()} className={`${linkClass} text-left`}>
        {t('navPacket')}
      </button>
      <p className="mt-auto text-xs leading-relaxed text-[#c5d8d0]">{t('guidanceOnly')}</p>
    </nav>
  )
}

export default Sidebar
