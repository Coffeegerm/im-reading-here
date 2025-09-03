import { BookDetailsContent } from "./book-details-content";

interface BookDetailsPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = params;

  return <BookDetailsContent bookId={id} />;
}
