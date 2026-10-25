import { useState } from 'react'
import { estimateTax } from '../lib/grtMath.js'
import { useLanguage } from '../lib/LanguageContext.jsx'

const inputClass =
  'mt-1 block min-h-11 w-full rounded-md border border-muted bg-white px-3 focus:outline-2 focus:outline-accent'
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const moneyEs = new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' })

// Nothing here is saved. The numbers live only in this component while the page is open.
function Calculator() {
  const { lang, t } = useLanguage()
  const [sales, setSales] = useState('')
  const [rate, setRate] = useState('')
  const tax = estimateTax(sales, rate)
  const hasInput = sales !== '' || rate !== ''

  return (
    <section id="estimate" className="rounded-xl bg-white p-5 print:hidden">
      <h2 className="text-xl font-bold">{t('calcHeading')}</h2>
      <p className="mt-2">
        {t('calcIntro')}{' '}
        <a
          href="https://www.tax.newmexico.gov/governments/gross-receipts-location-code-and-tax-rate-map/"
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-2"
        >
          {t('calcMapLink')}
        </a>
        . {t('calcIntroEnd')}
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="sales" className="font-medium">{t('salesLabel')}</label>
          <input
            id="sales"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="rate" className="font-medium">{t('rateLabel')}</label>
          <input
            id="rate"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="any"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        {tax !== null && (
          <p className="rounded-md bg-paper p-4">
            {t('estimatedTax')} <span className="font-semibold">{(lang === 'es' ? moneyEs : money).format(tax)}</span>
          </p>
        )}
        {tax === null && hasInput && (
          <p className="text-sm">{t('calcError')}</p>
        )}
      </div>
      <p className="mt-2 text-sm">
        {t('calcDisclaimer')}
      </p>
    </section>
  )
}

export default Calculator
