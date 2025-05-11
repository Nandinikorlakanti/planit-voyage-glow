import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Share2, 
  Settings, 
  DollarSign,
  MessageCircle,
  ClipboardCheck
} from "lucide-react";
import { TripProps } from "@/components/trips/TripCard";
import { useToast } from "@/hooks/use-toast";

// Mock trip data
const mockTrips: Record<string, TripProps> = {
  "trip-1": {
    id: "trip-1",
    name: "Italian Summer Adventure",
    description: "Exploring the beautiful cities and countryside of Italy.",
    location: "Rome, Florence, Venice",
    startDate: "2025-06-15",
    endDate: "2025-06-30",
    coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop",
    participantCount: 4,
    status: "upcoming",
  },
  "trip-2": {
    id: "trip-2",
    name: "Weekend Getaway in New York",
    description: "Quick weekend trip to explore NYC.",
    location: "New York, USA",
    startDate: "2025-05-20",
    endDate: "2025-05-22",
    coverImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop",
    participantCount: 2,
    status: "upcoming",
  },
  "trip-3": {
    id: "trip-3",
    name: "Tokyo Adventure",
    description: "Exploring the vibrant city of Tokyo and experiencing Japanese culture.",
    location: "Tokyo, Japan",
    startDate: "2025-05-15",
    endDate: "2025-05-18",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
    participantCount: 3,
    status: "ongoing",
  },
};

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareCode, setShareCode] = useState("TRIP1234");
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (id && mockTrips[id]) {
        setTrip(mockTrips[id]);
      }
      setIsLoading(false);
    }, 800);
  }, [id]);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    toast({
      title: "Code copied!",
      description: "Trip sharing code copied to clipboard."
    });
  };
  
  // Format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };
  
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container py-10">
          <div className="h-64 bg-muted rounded-lg animate-pulse mb-6"></div>
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse mb-8"></div>
          <div className="h-10 bg-muted rounded w-full animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-muted rounded animate-pulse"></div>
            <div className="h-40 bg-muted rounded animate-pulse"></div>
            <div className="h-40 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  if (!trip) {
    return (
      <PageTransition>
        <div className="container py-10">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-muted-foreground">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold mb-2">Trip Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              The trip you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div>
        {/* Cover Image Header */}
        <div 
          className="relative h-[300px] bg-cover bg-center" 
          style={{ backgroundImage: `url(${trip.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          
          <div className="container relative z-10 h-full flex flex-col justify-end pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                  {trip.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1.5 h-4 w-4" />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1.5 h-4 w-4" />
                    <span>{trip.participantCount} {trip.participantCount === 1 ? "Traveler" : "Travelers"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Trip
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30" onClick={handleCopyCode}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-8">
          {/* Shareable Code Banner */}
          <div className="mb-8 bg-muted p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-background border rounded p-2 mr-4">
                <span className="font-mono font-bold">{shareCode}</span>
              </div>
              <span className="text-sm text-muted-foreground">Share this code to invite others to your trip</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleCopyCode}>Copy Code</Button>
          </div>
          
          {/* Description */}
          {trip.description && (
            <p className="text-muted-foreground mb-8">{trip.description}</p>
          )}
          
          {/* Tab Navigation */}
          <Tabs defaultValue="itinerary" className="space-y-8">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="itinerary" className="flex-1 sm:flex-none">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Itinerary
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1 sm:flex-none">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex-1 sm:flex-none">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 sm:flex-none">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>
            
            {/* Itinerary Tab */}
            <TabsContent value="itinerary">
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="font-heading text-xl font-semibold mb-4">Trip Itinerary</h2>
                <p className="text-muted-foreground mb-6">
                  Plan your daily activities and events for this trip.
                </p>
                
                {/* Placeholder content */}
                <div className="flex flex-col gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Day 1 - {formatDate(trip.startDate)}</div>
                    <p className="text-sm text-muted-foreground">No activities planned yet</p>
                  </div>
                  
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Participants Tab */}
            <TabsContent value="participants">
              <div className="border rounded-lg p-6 bg-card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl font-semibold">Trip Participants</h2>
                  <Button size="sm">Invite More</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <span className="font-medium text-primary">YS</span>
                      </div>
                      <div>
                        <p className="font-medium">You (Organizer)</p>
                        <p className="text-xs text-muted-foreground">you@example.com</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Organizer</span>
                  </div>
                  
                  {/* Other participants */}
                  {Array.from({ length: trip.participantCount - 1 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                          <span className="font-medium">
                            {["JD", "AR", "TM"][i % 3]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {["John Doe", "Alex Rodriguez", "Taylor Moore"][i % 3]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {["john@example.com", "alex@example.com", "taylor@example.com"][i % 3]}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Member</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Budget Tab */}
            <TabsContent value="budget">
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="font-heading text-xl font-semibold mb-4">Trip Budget</h2>
                <p className="text-muted-foreground mb-6">
                  Track expenses and manage your trip budget.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">No expenses added yet</p>
                  </div>
                  
                  <Button variant="outline">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Chat Tab */}
            <TabsContent value="chat">
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="font-heading text-xl font-semibold mb-4">Trip Chat</h2>
                <p className="text-muted-foreground mb-6">
                  Communicate with your trip participants.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="border rounded-lg p-4 h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">Chat will be available once more participants join</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button>Send</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
