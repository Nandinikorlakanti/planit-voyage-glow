
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { TripCard, TripProps } from "@/components/trips/TripCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

// Mock data for trips
const mockTrips: TripProps[] = [
  {
    id: "trip-1",
    name: "Italian Summer Adventure",
    description: "Exploring the beautiful cities and countryside of Italy.",
    location: "Rome, Florence, Venice",
    startDate: "2025-06-15",
    endDate: "2025-06-30",
    coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop",
    participantCount: 4,
    status: "upcoming",
  },
  {
    id: "trip-2",
    name: "Weekend Getaway in New York",
    description: "Quick weekend trip to explore NYC.",
    location: "New York, USA",
    startDate: "2025-05-20",
    endDate: "2025-05-22",
    coverImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop",
    participantCount: 2,
    status: "upcoming",
  },
  {
    id: "trip-3",
    name: "Tokyo Adventure",
    location: "Tokyo, Japan",
    startDate: "2025-05-15",
    endDate: "2025-05-18",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
    participantCount: 3,
    status: "ongoing",
  },
  {
    id: "trip-4",
    name: "Paris Weekend",
    location: "Paris, France",
    startDate: "2025-01-10",
    endDate: "2025-01-15",
    coverImage: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=600&auto=format&fit=crop",
    participantCount: 2,
    status: "past",
  },
  {
    id: "trip-5",
    name: "Bali Retreat",
    description: "Relaxing beach vacation in Bali.",
    location: "Bali, Indonesia",
    startDate: "2024-12-05",
    endDate: "2024-12-15",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
    participantCount: 5,
    status: "past",
  },
];

export default function Dashboard() {
  const [upcomingTrips, setUpcomingTrips] = useState<TripProps[]>([]);
  const [ongoingTrips, setOngoingTrips] = useState<TripProps[]>([]);
  const [pastTrips, setPastTrips] = useState<TripProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUpcomingTrips(mockTrips.filter(trip => trip.status === "upcoming"));
      setOngoingTrips(mockTrips.filter(trip => trip.status === "ongoing"));
      setPastTrips(mockTrips.filter(trip => trip.status === "past"));
      setIsLoading(false);
    }, 800);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="container py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Your Trips</h1>
            <p className="text-muted-foreground">Manage and explore your travel plans</p>
          </div>
          <Button size="lg" className="shrink-0" asChild>
            <Link to="/trips/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Trip
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
              Upcoming
              {upcomingTrips.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                  {upcomingTrips.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="flex-1 sm:flex-none">
              Ongoing
              {ongoingTrips.length > 0 && (
                <span className="ml-2 bg-secondary/10 text-secondary rounded-full px-2 py-0.5 text-xs">
                  {ongoingTrips.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1 sm:flex-none">
              Past
              {pastTrips.length > 0 && (
                <span className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                  {pastTrips.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 sm:flex-none">All</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="upcoming">
                {upcomingTrips.length > 0 ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {upcomingTrips.map((trip) => (
                      <motion.div key={trip.id} variants={item}>
                        <TripCard {...trip} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    title="No upcoming trips"
                    description="You don't have any upcoming trips yet. Start planning your next adventure!"
                  />
                )}
              </TabsContent>

              <TabsContent value="ongoing">
                {ongoingTrips.length > 0 ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {ongoingTrips.map((trip) => (
                      <motion.div key={trip.id} variants={item}>
                        <TripCard {...trip} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    title="No ongoing trips"
                    description="You don't have any ongoing trips at the moment."
                  />
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastTrips.length > 0 ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {pastTrips.map((trip) => (
                      <motion.div key={trip.id} variants={item}>
                        <TripCard {...trip} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    title="No past trips"
                    description="You haven't completed any trips yet."
                  />
                )}
              </TabsContent>

              <TabsContent value="all">
                {mockTrips.length > 0 ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {mockTrips.map((trip) => (
                      <motion.div key={trip.id} variants={item}>
                        <TripCard {...trip} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    title="No trips found"
                    description="You haven't created any trips yet. Start planning your next adventure!"
                  />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </PageTransition>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-muted-foreground">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 className="font-heading text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">{description}</p>
      <Button asChild>
        <Link to="/trips/create">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create a Trip
        </Link>
      </Button>
    </div>
  );
}
