import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

interface ClubMember {
  id: string
  name: string
  avatarUrl?: string
}

interface ClubCardProps {
  name: string
  description?: string
  memberCount: number
  isPublic: boolean
  currentBook?: {
    title: string
    coverUrl?: string
  }
  nextMeeting?: {
    date: Date
    mode: 'IN_PERSON' | 'VIRTUAL'
  }
  members?: ClubMember[]
  userRole?: 'OWNER' | 'ADMIN' | 'MEMBER'
  className?: string
  onJoin?: () => void
  onView?: () => void
}

const ClubCard = React.forwardRef<HTMLDivElement, ClubCardProps>(
  ({
    name,
    description,
    memberCount,
    isPublic,
    currentBook,
    nextMeeting,
    members = [],
    userRole,
    className,
    onJoin,
    onView,
    ...props
  }, ref) => {
    const canJoin = !userRole && onJoin

    return (
      <Card ref={ref} className={cn("w-full group hover:shadow-md transition-shadow", className)} {...props}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1">{name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {description || "No description available"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {userRole && (
                <Badge variant={userRole === 'OWNER' ? 'default' : 'secondary'} className="text-xs">
                  {userRole}
                </Badge>
              )}
              <Badge variant={isPublic ? 'outline' : 'secondary'} className="text-xs">
                {isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
            {members.length > 0 && (
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                    +{members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {currentBook && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Currently reading</p>
              <p className="text-sm font-medium line-clamp-1">{currentBook.title}</p>
            </div>
          )}

          {nextMeeting && (
            <div className="text-xs text-muted-foreground">
              Next meeting: {nextMeeting.date.toLocaleDateString()} • {nextMeeting.mode === 'VIRTUAL' ? 'Virtual' : 'In-person'}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {canJoin && (
              <Button size="sm" onClick={onJoin} className="flex-1">
                Join Club
              </Button>
            )}
            {onView && (
              <Button size="sm" variant={canJoin ? "outline" : "default"} onClick={onView} className={canJoin ? "" : "flex-1"}>
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

ClubCard.displayName = "ClubCard"

export { ClubCard }
