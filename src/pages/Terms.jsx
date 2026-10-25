import LegalPage from '../components/LegalPage.jsx'
import { useLanguage } from '../lib/LanguageContext.jsx'

// Plain-language terms. Keep claims limited to what the app really does and does not do.
// The Spanish text is a courtesy translation and needs review by a fluent speaker.
const content = {
  en: {
    title: 'Terms of use',
    updated: 'Last updated: October 24, 2026',
    sections: [
      {
        heading: 'Guidance only',
        paragraphs: [
          'Bizcheck NM gives general guidance for small businesses in New Mexico. It is not legal or tax advice. Using the app does not make us your lawyer, accountant, or tax preparer.',
        ],
      },
      {
        heading: 'Rules can change',
        paragraphs: [
          'Tax and city rules change. Each task shows its official source and the date we last checked it. Tasks marked "Needs check" have not been confirmed against an official source yet.',
        ],
      },
      {
        heading: 'Confirm before you act',
        paragraphs: [
          'Before you file, pay, or sign anything, confirm the details with the official agency, such as the New Mexico Taxation and Revenue Department or the City of Alamogordo, or with a qualified professional such as an accountant or attorney. If the app and an official source disagree, follow the official source.',
        ],
      },
      {
        heading: 'Due dates',
        paragraphs: [
          "Due dates are calculated from the filing schedule you choose. The state assigns your schedule, so check which one applies to you. If the app's list of state holidays is missing a date, a due date may be shown one business day too early.",
        ],
      },
      {
        heading: 'Not a government website',
        paragraphs: [
          'Bizcheck NM is a student project. It is not run by or connected to the State of New Mexico or the City of Alamogordo.',
        ],
      },
      {
        heading: 'No guarantee',
        paragraphs: [
          'We work to keep the information accurate, but we cannot promise it is complete, current, or free of errors. You are responsible for meeting your own filing and payment deadlines. We are not responsible for penalties, interest, or other losses from using the app.',
        ],
      },
      { heading: 'Contact', paragraphs: ['Report an error or ask a question: magj09@icloud.com'] },
    ],
  },
  es: {
    title: 'Términos de uso',
    updated: 'Última actualización: 24 de octubre de 2026',
    notice:
      'Esta es una traducción de cortesía. Si hay alguna diferencia con la versión en inglés, prevalece la versión en inglés.',
    sections: [
      {
        heading: 'Solo orientación',
        paragraphs: [
          'Bizcheck NM ofrece orientación general para pequeños negocios en Nuevo México. No es asesoría legal ni fiscal. Usar la aplicación no nos convierte en su abogado, contador ni preparador de impuestos.',
        ],
      },
      {
        heading: 'Las reglas pueden cambiar',
        paragraphs: [
          'Las reglas de impuestos y de la ciudad cambian. Cada tarea muestra su fuente oficial y la fecha en que la verificamos por última vez. Las tareas marcadas como "Por verificar" todavía no se han confirmado con una fuente oficial.',
        ],
      },
      {
        heading: 'Confirme antes de actuar',
        paragraphs: [
          'Antes de presentar, pagar o firmar algo, confirme los detalles con la agencia oficial, como el Departamento de Impuestos y Rentas de Nuevo México (Taxation and Revenue Department) o la Ciudad de Alamogordo, o con un profesional calificado, como un contador o un abogado. Si la aplicación y una fuente oficial no coinciden, siga la fuente oficial.',
        ],
      },
      {
        heading: 'Fechas de vencimiento',
        paragraphs: [
          'Las fechas de vencimiento se calculan según el calendario de presentación que usted elija. El estado le asigna su calendario, así que verifique cuál le corresponde. Si a la lista de días feriados estatales de la aplicación le falta una fecha, es posible que se muestre una fecha de vencimiento un día hábil antes de lo debido.',
        ],
      },
      {
        heading: 'No es un sitio web del gobierno',
        paragraphs: [
          'Bizcheck NM es un proyecto estudiantil. No está operado por el Estado de Nuevo México ni por la Ciudad de Alamogordo, ni está conectado con ellos.',
        ],
      },
      {
        heading: 'Sin garantía',
        paragraphs: [
          'Nos esforzamos por mantener la información correcta, pero no podemos prometer que esté completa, actualizada o libre de errores. Usted es responsable de cumplir sus propias fechas de presentación y pago. No somos responsables de multas, intereses ni otras pérdidas por usar la aplicación.',
        ],
      },
      { heading: 'Contacto', paragraphs: ['Informe un error o haga una pregunta: magj09@icloud.com'] },
    ],
  },
}

function Terms() {
  const { lang } = useLanguage()
  return <LegalPage content={content[lang]} />
}

export default Terms
