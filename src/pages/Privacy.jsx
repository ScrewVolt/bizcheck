import LegalPage from '../components/LegalPage.jsx'
import { useLanguage } from '../lib/LanguageContext.jsx'

// Every statement here must match what the code actually does. Update BOTH languages if that changes.
// The Spanish text is a courtesy translation and needs review by a fluent speaker.
const content = {
  en: {
    title: 'Privacy',
    updated: 'Last updated: October 24, 2026',
    intro:
      'Bizcheck NM has no accounts and does not send your answers to us. Your answers stay in your own browser.',
    sections: [
      {
        heading: 'What the app saves',
        list: [
          'Your answers to the three questions: whether your business is in Alamogordo or somewhere else in New Mexico, whether you have employees, and how often you file gross receipts tax.',
          'Which checklist tasks you marked as done.',
          'Which tax deadlines you marked as filed.',
          'Whether you chose English or Spanish.',
        ],
        paragraphs: [
          "These are saved in your browser's localStorage, a storage area on your own device. They are not sent to us or to anyone else. Anyone who uses the same browser on the same device can see them. The numbers you type into the estimate calculator are not saved.",
        ],
      },
      {
        heading: 'What the app does not collect',
        paragraphs: [
          'We never ask for your name, Social Security number, tax ID number, or bank details. The app has no accounts, no analytics, no ads, no tracking, and does not set cookies.',
        ],
      },
      {
        heading: 'Calendar file',
        paragraphs: ['When you download the calendar file, it is created on your device. Nothing is sent to us.'],
      },
      {
        heading: 'Links to other websites',
        paragraphs: [
          "The checklist links to official New Mexico government websites. When you open one, that website's own privacy policy applies.",
        ],
      },
      {
        heading: 'Website hosting',
        paragraphs: [
          'This website is hosted by Netlify. Like any web host, it receives basic technical information when your browser loads the site, such as your IP address, and may keep it in its server logs. We do not use this information to track you.',
        ],
      },
      {
        heading: 'How to delete your answers',
        paragraphs: [
          'Clear the site data for this website in your browser settings. This removes your answers and your done marks. If you use a private window, your browser usually removes them when you close the window.',
        ],
      },
      {
        heading: 'Changes to this page',
        paragraphs: [
          'If the app starts saving or sending anything new, we will update this page and the date at the top.',
        ],
      },
      { heading: 'Contact', paragraphs: ['Questions about privacy: magj09@icloud.com'] },
    ],
  },
  es: {
    title: 'Privacidad',
    updated: 'Última actualización: 24 de octubre de 2026',
    notice:
      'Esta es una traducción de cortesía. Si hay alguna diferencia con la versión en inglés, prevalece la versión en inglés.',
    intro:
      'Bizcheck NM no tiene cuentas y no nos envía sus respuestas. Sus respuestas se quedan en su propio navegador.',
    sections: [
      {
        heading: 'Lo que guarda la aplicación',
        list: [
          'Sus respuestas a las tres preguntas: si su negocio está en Alamogordo o en otro lugar de Nuevo México, si tiene empleados y con qué frecuencia presenta el impuesto sobre los ingresos brutos.',
          'Qué tareas de la lista marcó como hechas.',
          'Qué fechas límite de impuestos marcó como presentadas.',
          'Si eligió inglés o español.',
        ],
        paragraphs: [
          'Esto se guarda en el localStorage de su navegador, un área de almacenamiento en su propio dispositivo. No se envía a nosotros ni a nadie más. Cualquier persona que use el mismo navegador en el mismo dispositivo puede verlo. Los números que escribe en la calculadora de estimados no se guardan.',
        ],
      },
      {
        heading: 'Lo que la aplicación no recopila',
        paragraphs: [
          'Nunca pedimos su nombre, número de Seguro Social, número de identificación fiscal ni datos bancarios. La aplicación no tiene cuentas, ni analíticas, ni anuncios, ni rastreo, y no usa cookies.',
        ],
      },
      {
        heading: 'Archivo de calendario',
        paragraphs: ['Cuando descarga el archivo de calendario, este se crea en su dispositivo. No se nos envía nada.'],
      },
      {
        heading: 'Enlaces a otros sitios web',
        paragraphs: [
          'La lista de tareas enlaza a sitios web oficiales del gobierno de Nuevo México. Cuando abre uno, se aplica la política de privacidad de ese sitio.',
        ],
      },
      {
        heading: 'Alojamiento del sitio web',
        paragraphs: [
          'Este sitio web está alojado por Netlify. Como cualquier servicio de alojamiento, recibe información técnica básica cuando su navegador carga el sitio, como su dirección IP, y puede guardarla en los registros de su servidor. No usamos esta información para rastrearlo.',
        ],
      },
      {
        heading: 'Cómo borrar sus respuestas',
        paragraphs: [
          'Borre los datos de este sitio web en la configuración de su navegador. Esto elimina sus respuestas y sus marcas de hecho. Si usa una ventana privada, su navegador normalmente las elimina al cerrar la ventana.',
        ],
      },
      {
        heading: 'Cambios en esta página',
        paragraphs: [
          'Si la aplicación empieza a guardar o enviar algo nuevo, actualizaremos esta página y la fecha de arriba.',
        ],
      },
      { heading: 'Contacto', paragraphs: ['Preguntas sobre privacidad: magj09@icloud.com'] },
    ],
  },
}

function Privacy() {
  const { lang } = useLanguage()
  return <LegalPage content={content[lang]} />
}

export default Privacy
