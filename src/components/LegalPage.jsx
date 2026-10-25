// Shared layout for the Privacy and Terms pages.
// content = { title, updated, notice?, intro?, sections: [{ heading, paragraphs?, list? }] }
function LegalPage({ content }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-8">
      <h1 className="text-2xl font-semibold">{content.title}</h1>
      <p className="mt-1 text-sm">{content.updated}</p>
      {content.notice && <p className="mt-3 rounded-xl bg-white p-3 text-sm">{content.notice}</p>}
      {content.intro && <p className="mt-4">{content.intro}</p>}

      {content.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mt-8 text-xl font-semibold">{section.heading}</h2>
          {section.list && (
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((text) => (
            <p key={text} className="mt-2">{text}</p>
          ))}
        </section>
      ))}
    </main>
  )
}

export default LegalPage
