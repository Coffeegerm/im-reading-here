import { CalendarIcon, MapPinIcon, VideoIcon, ClockIcon } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatDateTime } from "@/lib/utils"

interface MeetingCardProps {
  title?: string
  startsAt: Date
  endsAt?: Date
  mode: 'IN_PERSON' | 'VIRTUAL'
  location?: string
  videoLink?: string
  agenda?: string
  currentBook?: {
    title: string
    coverUrl?: string
  }
  rsvpStatus?: 'GOING' | 'MAYBE' | 'NO'
  rsvpCount?: number
  className?: string
  onRSVP?: (status: 'GOING' | 'MAYBE' | 'NO') => void
  onViewDetails?: () => void
}

const MeetingCard = React.forwardRef<HTMLDivElement, MeetingCardProps>(
  ({
    title,
    startsAt,
    endsAt,
    mode,
    location,
    videoLink,
    agenda,
    currentBook,
    rsvpStatus,
    rsvpCount,
    className,
    onRSVP,
    onViewDetails,
    ...props
  }, ref) => {
    const isUpcoming = startsAt > new Date()
    const isPast = startsAt < new Date()

    return (
      <Card ref={ref} className={cn("w-full group hover:shadow-md transition-shadow", className)} {...props}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {title || `${mode === 'VIRTUAL' ? 'Virtual' : 'In-Person'} Meeting`}
              </CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDateTime(startsAt)}
                </div>
                {endsAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <ClockIcon className="w-3 h-3" />
                    Duration: {Math.round((endsAt.getTime() - startsAt.getTime()) / (1000 * 60))} min
                  </div>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={mode === 'VIRTUAL' ? 'default' : 'secondary'} className="text-xs">
                {mode === 'VIRTUAL' ? (
                  <><VideoIcon className="w-3 h-3 mr-1" />Virtual</>
                ) : (
                  <><MapPinIcon className="w-3 h-3 mr-1" />In-Person</>
                )}
              </Badge>
              {isPast && <Badge variant="outline" className="text-xs">Past</Badge>}
              {rsvpStatus && (
                <Badge
                  variant={rsvpStatus === 'GOING' ? 'default' : rsvpStatus === 'MAYBE' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {rsvpStatus}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(location || videoLink) && (
            <div className="text-sm">
              {mode === 'IN_PERSON' && location && (
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{location}</span>
                </div>
              )}
              {mode === 'VIRTUAL' && videoLink && (
                <div className="flex items-center gap-2">
                  <VideoIcon className="w-4 h-4 text-muted-foreground" />
                  <a href={videoLink} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Join Virtual Meeting
                  </a>
                </div>
              )}
            </div>
          )}

          {currentBook && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Discussion topic</p>
              <p className="text-sm font-medium">{currentBook.title}</p>
            </div>
          )}

          {agenda && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Agenda</p>
              <p className="text-sm line-clamp-3">{agenda}</p>
            </div>
          )}

          {rsvpCount !== undefined && (
            <div className="text-xs text-muted-foreground">
              {rsvpCount} {rsvpCount === 1 ? 'person has' : 'people have'} RSVP'd
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onRSVP && isUpcoming && (
              <>
                <Button
                  size="sm"
                  variant={rsvpStatus === 'GOING' ? 'default' : 'outline'}
                  onClick={() => onRSVP('GOING')}
                  className="flex-1"
                >
                  Going
                </Button>
                <Button
                  size="sm"
                  variant={rsvpStatus === 'MAYBE' ? 'default' : 'outline'}
                  onClick={() => onRSVP('MAYBE')}
                  className="flex-1"
                >
                  Maybe
                </Button>
                <Button
                  size="sm"
                  variant={rsvpStatus === 'NO' ? 'destructive' : 'outline'}
                  onClick={() => onRSVP('NO')}
                  className="flex-1"
                >
                  Can't Go
                </Button>
              </>
            )}
            {onViewDetails && (
              <Button size="sm" variant="outline" onClick={onViewDetails}>
                Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

MeetingCard.displayName = "MeetingCard"

export { MeetingCard }
