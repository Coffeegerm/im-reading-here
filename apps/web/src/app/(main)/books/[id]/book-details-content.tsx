"use client";

import Image from "next/image";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useBookDetails } from "@/hooks/use-books";

interface BookDetailsContentProps {
  bookId: string;
}

export function BookDetailsContent({ bookId }: BookDetailsContentProps) {
  const { data: book, isLoading, error } = useBookDetails(bookId);

  if (isLoading) return <div>Loading book details...</div>;
  if (error) return <div>Error loading book details</div>;

  return (
    <Card>
      <CardHeader>
        {book?.title ? `${book.title}` : `Book ${bookId}`}
      </CardHeader>
      <CardContent>
        {book ? (
          <div className="space-y-4">
            {book.coverUrl && (
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={200}
                height={300}
                className="rounded-md"
              />
            )}
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
          </div>
        ) : (
          <p>Book details will go here...</p>
        )}
      </CardContent>
    </Card>
  );
}
