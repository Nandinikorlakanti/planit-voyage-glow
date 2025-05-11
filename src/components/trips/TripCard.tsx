
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type TripStatus = "upcoming" | "ongoing" | "past";

export type TripProps = {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  participantCount: number;
  status: TripStatus;
};

export function TripCard({
  id,
  name,
  description,
  location,
  startDate,
  endDate,
  coverImage,
  participantCount,
  status,
}: TripProps) {
  const statusStyles = {
    upcoming: {
      className: "trip-card-upcoming",
      badgeVariant: "default" as const,
      badgeText: "Upcoming",
    },
    ongoing: {
      className: "trip-card-ongoing",
      badgeVariant: "secondary" as const,
      badgeText: "Ongoing",
    },
    past: {
      className: "trip-card-past",
      badgeVariant: "outline" as const,
      badgeText: "Past",
    },
  };

  const { className, badgeVariant, badgeText } = statusStyles[status];

  // Format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Link 
      to={`/trips/${id}`} 
      className={cn("trip-card group", className)}
    >
      {/* Card Image */}
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge 
          variant={badgeVariant}
          className="absolute top-3 right-3"
        >
          {badgeText}
        </Badge>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold line-clamp-1">{name}</h3>
        
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            <span>{participantCount} {participantCount === 1 ? "Traveler" : "Travelers"}</span>
          </div>
        </div>
        
        {description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  );
}
