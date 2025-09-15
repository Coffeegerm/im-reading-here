"use client";

import Image from "next/image";

import { useBookDetails } from "@/hooks/use-books";

interface BookDetailsContentProps {
  bookId: string;
}

export function BookDetailsContent({ bookId }: BookDetailsContentProps) {
  const { data: book, isLoading, error } = useBookDetails(bookId);

  if (isLoading) return <div>Loading book details...</div>;
  if (error) return <div>Error loading book details</div>;

  return (
    <div>
      {book ? (
        <div className="flex flex-row gap-4">
          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt={book.title}
              width={200}
              height={300}
              className="rounded-md flex-shrink-0"
            />
          )}

          <div>
            <h2 className="text-2xl font-bold">
              {book?.title ? `${book.title}` : `Book ${bookId}`}
            </h2>
            <div>
              <h3 className="font-semibold">Authors:</h3>
              <p>
                {book.authors?.map((author) => author.name).join(", ") ||
                  "Unknown"}
              </p>
            </div>
            {book.firstPublishYear && (
              <div>
                <h3 className="font-semibold">First Published:</h3>
                <p>{book.firstPublishYear}</p>
              </div>
            )}
            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3 className="font-semibold">Subjects:</h3>
                <p>{book.subjects.join(", ")}</p>
              </div>
            )}

            {book.description?.length && (
              <div>
                <p className="whitespace-pre-line">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Book details will go here...</p>
      )}
    </div>
  );
}
