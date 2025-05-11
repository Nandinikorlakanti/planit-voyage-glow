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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Share2, 
  Settings, 
  DollarSign,
  MessageCircle,
  ClipboardCheck,
  Plus,
  Clock,
  Search,
  UserPlus,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  Send
} from "lucide-react";
import { TripProps } from "@/components/trips/TripCard";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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

// Activity categories with their visual properties
const activityCategories = [
  { id: "adventure", name: "Adventure", icon: Activity, color: "bg-orange-500" },
  { id: "food", name: "Food", icon: DollarSign, color: "bg-green-500" },
  { id: "sightseeing", name: "Sightseeing", icon: MapPin, color: "bg-blue-500" },
  { id: "transportation", name: "Transportation", icon: Activity, color: "bg-purple-500" },
  { id: "accommodation", name: "Accommodation", icon: Activity, color: "bg-amber-500" },
  { id: "other", name: "Other", icon: Activity, color: "bg-gray-500" },
];

// Mock activities data
const mockActivities = [
  {
    id: "activity-1",
    title: "Visit the Colosseum",
    date: "2025-06-16",
    startTime: "10:00",
    endTime: "12:00",
    duration: "2 hours",
    category: "sightseeing",
    location: "Piazza del Colosseo, Rome",
    cost: 16,
    notes: "Remember to book tickets in advance to skip the line.",
    images: ["https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop"],
    createdBy: "user-1",
    creatorName: "Jane Smith",
    upvotes: 3,
    downvotes: 0,
    status: "confirmed" // confirmed, suggested, declined
  },
  {
    id: "activity-2",
    title: "Pizza Making Class",
    date: "2025-06-17",
    startTime: "18:00",
    endTime: "21:00",
    duration: "3 hours",
    category: "food",
    location: "Via del Corso 12, Rome",
    cost: 45,
    notes: "Authentic Italian pizza making experience with local chefs.",
    images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop"],
    createdBy: "user-2",
    creatorName: "Alex Rodriguez",
    upvotes: 4,
    downvotes: 0,
    status: "suggested"
  },
  {
    id: "activity-3",
    title: "Vatican Museums Tour",
    date: "2025-06-18",
    startTime: "09:00",
    endTime: "13:00",
    duration: "4 hours",
    category: "sightseeing",
    location: "Vatican City",
    cost: 25,
    notes: "Guided tour includes Sistine Chapel and St. Peter's Basilica.",
    images: ["https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1600&auto=format&fit=crop"],
    createdBy: "user-1",
    creatorName: "Jane Smith",
    upvotes: 2,
    downvotes: 1,
    status: "confirmed"
  }
];

// Mock participants data
const mockParticipants = [
  { id: "user-1", name: "Jane Smith", email: "jane@example.com", avatar: "JS", isCreator: true, isActive: true, contributionCount: 5 },
  { id: "user-2", name: "Alex Rodriguez", email: "alex@example.com", avatar: "AR", isCreator: false, isActive: true, contributionCount: 3 },
  { id: "user-3", name: "Taylor Moore", email: "taylor@example.com", avatar: "TM", isCreator: false, isActive: false, contributionCount: 1 },
];

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareCode, setShareCode] = useState("TRIP1234");
  const [activities, setActivities] = useState(mockActivities);
  const [participants, setParticipants] = useState(mockParticipants);
  const [activeParticipants, setActiveParticipants] = useState(["user-1", "user-2"]);
  const [selectedDay, setSelectedDay] = useState("");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [invitePermission, setInvitePermission] = useState("editor");
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (id && mockTrips[id]) {
        setTrip(mockTrips[id]);
        // Set the first day of the trip as the selected day
        if (mockTrips[id].startDate) {
          setSelectedDay(mockTrips[id].startDate);
        }
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
  
  const handleInviteSubmit = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate sending invitation
    toast({
      title: "Invitation sent!",
      description: `Invitation sent to ${inviteEmail}. They'll receive a link to join the trip.`
    });
    
    setInviteEmail("");
    setInviteMessage("");
    setIsInviteModalOpen(false);
  };
  
  const handleRemoveParticipant = (userId: string) => {
    const participantToRemove = participants.find(p => p.id === userId);
    if (!participantToRemove) return;
    
    setParticipants(participants.filter(p => p.id !== userId));
    
    toast({
      title: "Participant removed",
      description: `${participantToRemove.name} has been removed from this trip.`
    });
  };
  
  const handleActivityVote = (activityId: string, voteType: 'up' | 'down') => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        if (voteType === 'up') {
          return { ...activity, upvotes: activity.upvotes + 1 };
        } else {
          return { ...activity, downvotes: activity.downvotes + 1 };
        }
      }
      return activity;
    }));
    
    toast({
      title: `Vote recorded`,
      description: `Your vote has been added.`
    });
  };
  
  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
    
    toast({
      title: "Activity deleted",
      description: "The activity has been removed from this trip."
    });
  };
  
  const handleConfirmActivity = (activityId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, status: activity.status === "confirmed" ? "suggested" : "confirmed" };
      }
      return activity;
    }));
    
    toast({
      title: "Activity status updated",
      description: "The activity status has been updated."
    });
  };
  
  // Format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };
  
  // Get activities for a specific day
  const getDayActivities = (date: string) => {
    return activities.filter(activity => activity.date === date);
  };
  
  // Generate an array of dates between start and end dates
  const getTripDays = () => {
    if (!trip) return [];
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = [];
    
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day).toISOString().split('T')[0]);
    }
    
    return days;
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
                <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Invite Travelers</DialogTitle>
                      <DialogDescription>
                        Send invitations to friends and family to join this trip.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email address
                        </label>
                        <Input
                          id="email"
                          placeholder="name@example.com"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="permission" className="text-sm font-medium">
                          Permission level
                        </label>
                        <select 
                          id="permission"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={invitePermission}
                          onChange={(e) => setInvitePermission(e.target.value)}
                        >
                          <option value="editor">Editor (can add and edit activities)</option>
                          <option value="viewer">Viewer (can only view trip details)</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Custom message (optional)
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Hey! Join me on this trip..."
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <label htmlFor="code" className="text-sm font-medium">
                            Or share trip code
                          </label>
                          <div className="flex">
                            <Input
                              id="code"
                              value={shareCode}
                              readOnly
                              className="rounded-r-none font-mono"
                            />
                            <Button 
                              onClick={handleCopyCode} 
                              className="rounded-l-none"
                              variant="secondary"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <Button type="button" onClick={handleInviteSubmit}>
                        Send Invitation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
          
          {/* Active Participants Indicator */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Currently viewing:</span>
            <div className="flex -space-x-2">
              {participants
                .filter(p => activeParticipants.includes(p.id))
                .map(participant => (
                  <div 
                    key={participant.id}
                    className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                    title={participant.name}
                  >
                    {participant.avatar}
                  </div>
                ))
              }
            </div>
            <span className="text-xs text-muted-foreground">
              {activeParticipants.length} active
            </span>
          </div>
          
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold">Trip Itinerary</h2>
                  <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Activity</DialogTitle>
                        <DialogDescription>
                          Add details about the activity you want to plan.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="title" className="text-sm font-medium">
                            Activity Title
                          </label>
                          <Input id="title" placeholder="e.g. Visit the Eiffel Tower" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label htmlFor="date" className="text-sm font-medium">
                              Date
                            </label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>Pick a date</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent className="pointer-events-auto" />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="time" className="text-sm font-medium">
                              Start Time
                            </label>
                            <Input
                              id="time"
                              type="time"
                              defaultValue="09:00"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label htmlFor="duration" className="text-sm font-medium">
                              Duration
                            </label>
                            <div className="flex items-center">
                              <Input
                                id="duration"
                                type="number"
                                min="1"
                                defaultValue="2"
                              />
                              <span className="ml-2 text-sm">hours</span>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="category" className="text-sm font-medium">
                              Category
                            </label>
                            <select 
                              id="category"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              {activityCategories.map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="location" className="text-sm font-medium">
                            Location
                          </label>
                          <Input id="location" placeholder="Address or place name" />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="cost" className="text-sm font-medium">
                            Cost per person (optional)
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="cost" type="number" min="0" step="0.01" className="pl-9" />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="notes" className="text-sm font-medium">
                            Notes (optional)
                          </label>
                          <Textarea
                            id="notes"
                            placeholder="Add any additional details..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={() => setIsActivityModalOpen(false)}>
                          Add Activity
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Day Selector */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
                  {getTripDays().map((day, index) => (
                    <Button
                      key={day}
                      variant={day === selectedDay ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(day)}
                      className="whitespace-nowrap"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Day {index + 1} ({new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                    </Button>
                  ))}
                </div>
                
                {/* Activities Timeline */}
                <div className="space-y-6">
                  {selectedDay && (
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>
                      
                      {getDayActivities(selectedDay).length > 0 ? (
                        getDayActivities(selectedDay).map((activity, index) => (
                          <div 
                            key={activity.id} 
                            className="relative pl-12 pb-6 group animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="absolute left-2 top-1 h-6 w-6 rounded-full flex items-center justify-center bg-white border border-primary">
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                            
                            <div className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md group-hover:border-primary/40">
                              <div className={`px-4 py-3 flex justify-between items-center ${activityCategories.find(c => c.id === activity.category)?.color} bg-opacity-10`}>
                                <div className="flex items-center">
                                  <span className="font-medium text-base">{activity.title}</span>
                                  {activity.status === "confirmed" && (
                                    <Badge className="ml-2" variant="outline">Confirmed</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleConfirmActivity(activity.id)}>
                                    <ClipboardCheck className="h-4 w-4" />
                                    <span className="sr-only">Toggle confirmation</span>
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0 text-destructive" 
                                    onClick={() => handleDeleteActivity(activity.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center mb-4 gap-y-2 gap-x-6">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                                    <span>{activity.startTime} - {activity.endTime} ({activity.duration})</span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1.5 h-3.5 w-3.5" />
                                    <span>{activity.location}</span>
                                  </div>
                                  {activity.cost > 0 && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                                      <span>${activity.cost} per person</span>
                                    </div>
                                  )}
                                </div>
                                
                                {activity.notes && (
                                  <p className="text-sm text-muted-foreground mb-4">{activity.notes}</p>
                                )}
                                
                                {activity.images && activity.images.length > 0 && (
                                  <div className="mb-4">
                                    <img 
                                      src={activity.images[0]} 
                                      alt={activity.title} 
                                      className="w-full h-48 object-cover rounded-md"
                                    />
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-muted-foreground">
                                    Added by {activity.creatorName}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex gap-1.5"
                                      onClick={() => handleActivityVote(activity.id, 'up')}
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5" />
                                      <span>{activity.upvotes}</span>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex gap-1.5"
                                      onClick={() => handleActivityVote(activity.id, 'down')}
                                    >
                                      <ThumbsDown className="h-3.5 w-3.5" />
                                      <span>{activity.downvotes}</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-muted inline-flex items-center justify-center p-4 rounded-full
