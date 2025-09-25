"use client";
import { useShelf } from "@/hooks/use-shelves";

interface ShelfPageProps {
  params: {
    id: string;
  };
}

export default function ShelfPage({ params }: ShelfPageProps) {
  const { id } = params;

  const {} = useShelf(id);

  return <div>Shelf id: {id}</div>;
}
