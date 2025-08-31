import Image from "next/image"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BookCardProps {
  title: string
  authors: string[]
  coverUrl?: string
  rating?: number
  publishedYear?: number
  className?: string
  onAddToShelf?: () => void
  onViewDetails?: () => void
  shelf?: 'TBR' | 'READ' | 'DNF'
  isInClub?: boolean
}

const BookCard = React.forwardRef<HTMLDivElement, BookCardProps>(
  ({
    title,
    authors,
    coverUrl,
    rating,
    publishedYear,
    className,
    onAddToShelf,
    onViewDetails,
    shelf,
    isInClub,
    ...props
  }, ref) => {
    const formatAuthors = (authors: string[]) => {
      if (authors.length === 1) return authors[0]
      if (authors.length === 2) return `${authors[0]} & ${authors[1]}`
      return `${authors[0]} et al.`
    }

    return (
      <Card ref={ref} className={cn("w-full max-w-sm group hover:shadow-md transition-shadow", className)} {...props}>
        <CardHeader className="pb-3">
          <div className="flex gap-3">
            <div className="relative w-16 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={`Cover of ${title}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No Cover
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm leading-tight line-clamp-2">{title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {formatAuthors(authors)}
                {publishedYear && <span className="ml-2">({publishedYear})</span>}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                {shelf && (
                  <Badge variant={shelf === 'READ' ? 'default' : shelf === 'DNF' ? 'destructive' : 'secondary'} className="text-xs">
                    {shelf}
                  </Badge>
                )}
                {isInClub && <Badge variant="outline" className="text-xs">Club</Badge>}
                {rating && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    ⭐ {rating}/5
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {onAddToShelf && (
              <Button size="sm" variant="outline" onClick={onAddToShelf} className="flex-1">
                Add to Shelf
              </Button>
            )}
            {onViewDetails && (
              <Button size="sm" onClick={onViewDetails} className="flex-1">
                Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

BookCard.displayName = "BookCard"

export { BookCard }
