import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/LanguageContext.jsx'

const linkClass = 'inline-flex min-h-11 items-center text-accent underline underline-offset-2'

function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mt-auto w-full border-t border-line px-4 py-4 md:px-9 print:hidden">
      <nav aria-label={t('footerNav')} className="flex flex-wrap gap-x-6">
        <Link to="/" className={linkClass}>{t('footerQuestions')}</Link>
        <Link to="/checklist" className={linkClass}>{t('footerChecklist')}</Link>
        <Link to="/privacy" className={linkClass}>{t('footerPrivacy')}</Link>
        <Link to="/terms" className={linkClass}>{t('footerTerms')}</Link>
      </nav>
    </footer>
  )
}

export default Footer
