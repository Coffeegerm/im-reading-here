import { Book } from '@im-reading-here/shared';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getBookDetails } from '@/lib/books';

export default function BookDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: book } = useQuery({
    queryKey: ['getBookDetails', id],
    queryFn: () => getBookDetails(id as string),
    enabled: !!id,
  });

  if (!book) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold">{book.title}</h1>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{book.authors.join(', ')}</p>
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={200}
            height={300}
            className="mt-4 rounded-md"
          />
        )}
      </CardContent>
    </Card>
  );
}
