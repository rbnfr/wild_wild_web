import { StaticImage as Image } from "@/components/static-image";
import type { Dictionary } from "@/content/dictionaries";
import type { site } from "@/content/site";

export function Book({
  book,
  t,
}: {
  book: (typeof site.books)[number];
  t: Dictionary;
}) {
  const { outreach } = t;
  return (
    <article className="book">
      <div className="book-cover">
        <div className="book-cover-inner">
          <Image
            src={book.cover}
            width={book.coverWidth}
            height={book.coverHeight}
            sizes="(max-width: 600px) 220px, 240px"
            alt={outreach.coverAlt(book.title, book.author)}
          />
        </div>
      </div>
      <div className="book-details">
        <h4>{book.title}</h4>
        <p className="book-subtitle">{book.subtitle}</p>
        <p className="book-author">{book.author}</p>
        <p>{t.books[book.id]}</p>
        <p className="book-facts">
          {book.publisher}, {book.year} · {outreach.printEdition(book.pages)} ·
          ISBN: {book.isbn}
        </p>
        <a
          className="button"
          href={book.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {outreach.bookCta}
          <span className="visually-hidden"> {t.common.newTab}</span>
        </a>
      </div>
    </article>
  );
}
