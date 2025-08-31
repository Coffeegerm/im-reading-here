import { Book } from './types';

export function normalizeBookData(data: any): Book {
  return {
    id: data.id || data.key,
    title: data.title,
    authors: data.authors || [],
    coverUrl: data.coverUrl || data.cover_i,
    publishedYear: data.publishedYear || data.first_publish_year,
    subjects: data.subjects || [],
  };
}
