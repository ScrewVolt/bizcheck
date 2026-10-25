import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../data/translations.js'

const LANG_KEY = 'bizcheck-lang'

// Context lets any component read the language without passing it down through every parent.
const LanguageContext = createContext(null)

function loadLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    return saved === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadLanguage)

  // Keep the page's lang attribute right so screen readers pick the correct voice.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function setLanguage(next) {
    setLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      // If storage is blocked, the choice is just not remembered next visit.
    }
  }

  // If a Spanish string is missing, fall back to English instead of showing nothing.
  // vars fills in {name} slots, for example t('tasksDone', { done: 2, total: 5 }).
  function t(key, vars = {}) {
    const text = translations[lang][key] ?? translations.en[key] ?? key
    return text.replace(/\{(\w+)\}/g, (slot, name) => vars[name] ?? slot)
  }

  return (
    <LanguageContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
