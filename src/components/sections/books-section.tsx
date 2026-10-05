import { ExternalLink } from '@/components/ui/button'
import { Photo } from '@/components/ui/photo'
import { Section } from '@/components/ui/section'
import { books } from '@/content/books'
import { sections } from '@/content/site'
import type { Book } from '@/content/types'
import { cn } from '@/lib/cn'

function BookCard({ book }: { book: Book }) {
  const details: [label: string, value: string][] = [
    ...(book.publisher ? [['Editorial', book.publisher] as [string, string]] : []),
    ...(book.year ? [['Año', String(book.year)] as [string, string]] : []),
    ...(book.isbn ? [['ISBN', book.isbn] as [string, string]] : []),
  ]

  return (
    <article className="grid gap-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
      <div className="shadow-float">
        <Photo image={book.cover} sizes="176px" />
      </div>
      <div>
        <h3 className="text-h3 font-bold text-abeto">{book.title}</h3>
        {book.subtitle ? (
          <p className="mt-1 font-display text-lg font-medium text-musgo">{book.subtitle}</p>
        ) : null}
        {details.length > 0 ? (
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-display text-ui">
            {details.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-semibold text-abeto">{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="mt-4 max-w-[52ch]">{book.description}</p>
        {book.purchaseLinks.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-x-6">
            {book.purchaseLinks.map((link) => (
              <li key={link.href}>
                <ExternalLink
                  href={link.href}
                  className="inline-flex min-h-11 items-center font-display font-semibold text-abeto underline decoration-ambar decoration-2 underline-offset-[6px] hover:decoration-4"
                >
                  {link.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}

export function BooksSection() {
  const { id, title, intro } = sections.books
  if (books.length === 0) return null

  return (
    <Section id={id} title={title} intro={intro} tone="paper">
      <div className={cn('grid gap-14', books.length > 1 && 'xl:grid-cols-2')}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Section>
  )
}
