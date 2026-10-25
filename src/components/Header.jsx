import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/LanguageContext.jsx'

const base = 'min-h-11 rounded-md px-4 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-accent'

// Product name on the left, English / Español buttons on the right.
// aria-pressed tells screen readers which language is on. lang="es" makes them read "Español" correctly.
function Header() {
  const { lang, t, setLanguage } = useLanguage()
  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-9 print:hidden">
      <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        {/* alt is empty because the words next to the logo already name the app. */}
        <img src="/favicon.svg" alt="" width="32" height="32" />
        Bizcheck NM
      </Link>
      <div role="group" aria-label={t('languageGroup')} className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={lang === 'en'}
          className={`${base} ${lang === 'en' ? 'bg-ink font-bold text-white' : 'border border-muted bg-transparent'}`}
        >
          English
        </button>
        <button
          type="button"
          lang="es"
          onClick={() => setLanguage('es')}
          aria-pressed={lang === 'es'}
          className={`${base} ${lang === 'es' ? 'bg-ink font-bold text-white' : 'border border-muted bg-transparent'}`}
        >
          Español
        </button>
      </div>
    </header>
  )
}

export default Header
