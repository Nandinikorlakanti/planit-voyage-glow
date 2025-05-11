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
  Calendar as CalendarIcon, 
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
import { Calendar } from "@/components/ui/calendar";
import { BudgetDashboard } from "@/components/trip/budget/BudgetDashboard";
import { BudgetExpenses } from "@/components/trip/budget/BudgetExpenses";
import { BudgetAnalytics } from "@/components/trip/budget/BudgetAnalytics";
import { TripChat } from "@/components/trip/chat/TripChat";
import { TripPolls } from "@/components/trip/chat/TripPolls";
import { ChecklistManager } from "@/components/trip/checklist/ChecklistManager";
import { DocumentRepository } from "@/components/trip/documents/DocumentRepository";
import { TravelInfo } from "@/components/trip/info/TravelInfo";
import { TripMemories } from "@/components/trip/memories/TripMemories";

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

// Mock budget data
export const mockBudgetData = {
  totalBudget: 3000,
  spentAmount: 1250,
  categories: [
    { name: "Accommodation", budget: 1200, spent: 800, color: "bg-blue-500" },
    { name: "Food", budget: 600, spent: 250, color: "bg-green-500" },
    { name: "Activities", budget: 700, spent: 150, color: "bg-orange-500" },
    { name: "Transportation", budget: 400, spent: 50, color: "bg-purple-500" },
    { name: "Other", budget: 100, spent: 0, color: "bg-gray-500" }
  ],
  expenses: [
    { id: "exp-1", title: "Hotel Reservation", amount: 800, category: "Accommodation", paidBy: "user-1", paidByName: "Jane Smith", split: "equal", date: "2025-06-15", notes: "Two rooms for 5 nights", receipt: null },
    { id: "exp-2", title: "Train Tickets", amount: 50, category: "Transportation", paidBy: "user-2", paidByName: "Alex Rodriguez", split: "equal", date: "2025-06-15", notes: "Round trip", receipt: null },
    { id: "exp-3", title: "Pizza Dinner", amount: 85, category: "Food", paidBy: "user-1", paidByName: "Jane Smith", split: "equal", date: "2025-06-17", notes: "Restaurant near hotel", receipt: null },
    { id: "exp-4", title: "Museum Tickets", amount: 60, category: "Activities", paidBy: "user-3", paidByName: "Taylor Moore", split: "equal", date: "2025-06-18", notes: "Group discount applied", receipt: null },
    { id: "exp-5", title: "Breakfast Supplies", amount: 35, category: "Food", paidBy: "user-2", paidByName: "Alex Rodriguez", split: "equal", date: "2025-06-16", notes: "Groceries for the apartment", receipt: null },
    { id: "exp-6", title: "City Tour", amount: 90, category: "Activities", paidBy: "user-1", paidByName: "Jane Smith", split: "equal", date: "2025-06-19", notes: "Walking tour with guide", receipt: null },
    { id: "exp-7", title: "Taxi from Airport", amount: 50, category: "Transportation", paidBy: "user-3", paidByName: "Taylor Moore", split: "custom", splitDetails: [
      { userId: "user-1", amount: 20 }, 
      { userId: "user-2", amount: 20 }, 
      { userId: "user-3", amount: 10 }
    ], date: "2025-06-15", notes: "Airport to hotel", receipt: null }
  ],
  settlements: [
    { from: "user-2", to: "user-1", amount: 120, fromName: "Alex Rodriguez", toName: "Jane Smith" },
    { from: "user-3", to: "user-1", amount: 85, fromName: "Taylor Moore", toName: "Jane Smith" },
    { from: "user-1", to: "user-3", amount: 35, fromName: "Jane Smith", toName: "Taylor Moore" }
  ]
};

// Mock chat data
export const mockChatData = {
  messages: [
    { id: "msg-1", userId: "user-1", userName: "Jane Smith", avatar: "JS", content: "Hey everyone! I've booked the hotel rooms for our trip.", timestamp: "2023-04-10T14:30:00", reactions: [{ type: "👍", users: ["user-2", "user-3"] }], attachments: [] },
    { id: "msg-2", userId: "user-2", userName: "Alex Rodriguez", avatar: "AR", content: "Great! Should we start planning the activities?", timestamp: "2023-04-10T14:32:00", reactions: [], attachments: [] },
    { id: "msg-3", userId: "user-1", userName: "Jane Smith", avatar: "JS", content: "Yes! I've added a few suggestions to the itinerary. Please check them out and vote.", timestamp: "2023-04-10T14:35:00", reactions: [], attachments: [] },
    { id: "msg-4", userId: "user-3", userName: "Taylor Moore", avatar: "TM", content: "I'm excited for the museum tour! I've heard it's amazing.", timestamp: "2023-04-10T15:05:00", reactions: [{ type: "❤️", users: ["user-1"] }], attachments: [] },
    { id: "msg-5", userId: "user-2", userName: "Alex Rodriguez", avatar: "AR", content: "Has everyone checked the weather forecast? We might need to bring umbrellas.", timestamp: "2023-04-11T09:15:00", reactions: [], attachments: [] },
    { id: "msg-6", userId: "user-1", userName: "Jane Smith", avatar: "JS", content: "Good point! I'll add umbrellas to our packing list.", timestamp: "2023-04-11T09:20:00", reactions: [{ type: "👍", users: ["user-2"] }], attachments: [] },
    { id: "msg-7", userId: "user-3", userName: "Taylor Moore", avatar: "TM", content: "Here's the restaurant I was talking about for dinner on our first night.", timestamp: "2023-04-11T13:45:00", reactions: [], attachments: [
      { id: "att-1", type: "image", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop", name: "restaurant.jpg" }
    ] }
  ],
  polls: [
    { 
      id: "poll-1", 
      title: "Which museum should we visit?", 
      createdBy: "user-1", 
      creatorName: "Jane Smith",
      deadline: "2023-04-15T23:59:59", 
      options: [
        { id: "opt-1", text: "Modern Art Museum", votes: ["user-1", "user-3"] },
        { id: "opt-2", text: "Natural History Museum", votes: ["user-2"] },
        { id: "opt-3", text: "Science Museum", votes: [] }
      ]
    },
    { 
      id: "poll-2", 
      title: "Dinner preference for Saturday night?", 
      createdBy: "user-2", 
      creatorName: "Alex Rodriguez",
      deadline: "2023-04-20T18:00:00", 
      options: [
        { id: "opt-1", text: "Italian Restaurant", votes: ["user-1", "user-2"] },
        { id: "opt-2", text: "Local Cuisine", votes: ["user-3"] },
        { id: "opt-3", text: "Seafood Place", votes: [] }
      ]
    }
  ],
  announcements: [
    { 
      id: "ann-1", 
      title: "Hotel Booking Confirmed!", 
      content: "I've received confirmation for our hotel booking. Check-in time is 3 PM on June 15th.", 
      createdBy: "user-1", 
      creatorName: "Jane Smith", 
      timestamp: "2023-04-05T10:30:00", 
      readBy: ["user-2", "user-3"] 
    },
    { 
      id: "ann-2", 
      title: "Train Schedule Change", 
      content: "Our return train has been rescheduled to 5 PM instead of 3 PM. I've updated our itinerary accordingly.", 
      createdBy: "user-2", 
      creatorName: "Alex Rodriguez", 
      timestamp: "2023-04-09T16:45:00", 
      readBy: ["user-1"] 
    }
  ]
};

// Mock checklist data
export const mockChecklistData = {
  categories: [
    { 
      id: "cat-1", 
      name: "Essentials", 
      items: [
        { id: "item-1", text: "Passport", assigned: "all", completed: ["user-1", "user-2"] },
        { id: "item-2", text: "Travel insurance", assigned: "all", completed: ["user-1"] },
        { id: "item-3", text: "Credit cards", assigned: "all", completed: ["user-1", "user-2", "user-3"] },
        { id: "item-4", text: "Local currency", assigned: "all", completed: [] }
      ] 
    },
    { 
      id: "cat-2", 
      name: "Clothing", 
      items: [
        { id: "item-5", text: "Walking shoes", assigned: "all", completed: ["user-3"] },
        { id: "item-6", text: "Rain jacket", assigned: "all", completed: [] },
        { id: "item-7", text: "Swimwear", assigned: "all", completed: ["user-1"] }
      ] 
    },
    { 
      id: "cat-3", 
      name: "Electronics", 
      items: [
        { id: "item-8", text: "Phone charger", assigned: "all", completed: ["user-1", "user-2"] },
        { id: "item-9", text: "Camera", assigned: "user-2", completed: [] },
        { id: "item-10", text: "Power adapter", assigned: "user-1", completed: ["user-1"] }
      ] 
    }
  ]
};

// Mock documents data
export const mockDocumentData = {
  files: [
    { id: "file-1", name: "Hotel Reservation.pdf", type: "pdf", size: 1240000, uploadedBy: "user-1", uploaderName: "Jane Smith", timestamp: "2023-04-03T14:30:00", url: "#" },
    { id: "file-2", name: "Train Tickets.pdf", type: "pdf", size: 580000, uploadedBy: "user-2", uploaderName: "Alex Rodriguez", timestamp: "2023-04-05T10:15:00", url: "#" },
    { id: "file-3", name: "Museum Tour Confirmation.pdf", type: "pdf", size: 350000, uploadedBy: "user-1", uploaderName: "Jane Smith", timestamp: "2023-04-08T16:45:00", url: "#" },
    { id: "file-4", name: "Trip Planning Notes.docx", type: "docx", size: 450000, uploadedBy: "user-3", uploaderName: "Taylor Moore", timestamp: "2023-04-02T09:30:00", url: "#" },
    { id: "file-5", name: "Rome City Map.jpg", type: "jpg", size: 2340000, uploadedBy: "user-2", uploaderName: "Alex Rodriguez", timestamp: "2023-04-07T11:20:00", url: "#" },
    { id: "file-6", name: "Restaurant Recommendations.xlsx", type: "xlsx", size: 320000, uploadedBy: "user-3", uploaderName: "Taylor Moore", timestamp: "2023-04-09T13:10:00", url: "#" }
  ],
  folders: [
    { id: "folder-1", name: "Accommodations", files: ["file-1"] },
    { id: "folder-2", name: "Transportation", files: ["file-2"] },
    { id: "folder-3", name: "Activities", files: ["file-3"] },
    { id: "folder-4", name: "Planning", files: ["file-4", "file-6"] },
    { id: "folder-5", name: "Maps", files: ["file-5"] }
  ]
};

// Mock travel info data
export const mockTravelInfoData = {
  weather: {
    forecast: [
      { date: "2025-06-15", condition: "Sunny", high: 28, low: 18, precipitation: 0 },
      { date: "2025-06-16", condition: "Mostly Sunny", high: 27, low: 17, precipitation: 10 },
      { date: "2025-06-17", condition: "Partly Cloudy", high: 25, low: 16, precipitation: 20 },
      { date: "2025-06-18", condition: "Cloudy", high: 23, low: 15, precipitation: 30 },
      { date: "2025-06-19", condition: "Rainy", high: 21, low: 14, precipitation: 80 },
      { date: "2025-06-20", condition: "Partly Cloudy", high: 24, low: 16, precipitation: 20 },
      { date: "2025-06-21", condition: "Sunny", high: 26, low: 17, precipitation: 0 }
    ]
  },
  emergency: {
    police: "112",
    ambulance: "118",
    tourist_police: "+39 06 4686",
    embassy: "+39 06 46741",
    hospital: "Ospedale Santo Spirito, Via Vittorio Emanuele II, 12"
  },
  currency: {
    local: "EUR",
    exchange_rate: 1.06, // 1 EUR = 1.06 USD
    common_prices: [
      { item: "Coffee", price: 1.5 },
      { item: "Public Transport (Single Trip)", price: 1.5 },
      { item: "Restaurant Meal (Average)", price: 20 },
      { item: "Bottle of Water", price: 1 },
      { item: "Museum Entrance", price: 15 }
    ]
  },
  language: {
    phrases: [
      { english: "Hello", local: "Ciao" },
      { english: "Thank you", local: "Grazie" },
      { english: "Please", local: "Per favore" },
      { english: "Excuse me", local: "Mi scusi" },
      { english: "Where is...?", local: "Dov'è...?" },
      { english: "How much?", local: "Quanto costa?" },
      { english: "Help!", local: "Aiuto!" },
      { english: "I don't understand", local: "Non capisco" }
    ]
  },
  customs: [
    { title: "Tipping", description: "Tipping is not expected but appreciated. Leaving 5-10% for good service is common." },
    { title: "Greetings", description: "Italians typically greet with a handshake or 'kiss on both cheeks' among friends." },
    { title: "Dining", description: "Dinner is usually eaten late, around 8-9 PM. Cappuccino is considered a morning drink only." },
    { title: "Dress Code", description: "Dress modestly when visiting churches. Shoulders and knees should be covered." },
    { title: "Siesta", description: "Many shops close for a few hours in the afternoon, typically 1-4 PM." }
  ]
};

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
  
  // Budget state
  const [budgetData, setBudgetData] = useState(mockBudgetData);
  
  // Communication state
  const [chatData, setChatData] = useState(mockChatData);
  
  // Current user ID (for components that need it)
  const currentUserId = "user-1"; // Hardcoded for now, would come from auth system in a real app
  
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
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">
                  {trip.name}
                </h1>
                <p className="text-white/80 text-lg">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                <MapPin className="h-3 w-3 mr-1" />
                {trip.location}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                <Users className="h-3 w-3 mr-1" />
                {trip.participantCount} travelers
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white capitalize">
                {trip.status}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Tabs navigation */}
        <div className="container py-6">
          <Tabs defaultValue="itinerary" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="chat">Communication</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="info">Travel Info</TabsTrigger>
              <TabsTrigger value="memories">Memories</TabsTrigger>
            </TabsList>
            
            {/* Itinerary Tab Content */}
            <TabsContent value="itinerary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-xl">Daily Schedule</CardTitle>
                        <CardDescription>Plan your activities by day</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <div className="flex overflow-x-auto space-x-2 pb-4">
                        {getTripDays().map((day) => (
                          <Button 
                            key={day} 
                            variant={selectedDay === day ? "default" : "outline"} 
                            className="flex-shrink-0"
                            onClick={() => setSelectedDay(day)}
                          >
                            {new Date(day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                          </Button>
                        ))}
                      </div>
                      
                      {selectedDay && (
                        <div className="space-y-4 mt-4">
                          <h3 className="font-medium text-lg">
                            {new Date(selectedDay).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </h3>
                          
                          {getDayActivities(selectedDay).length > 0 ? (
                            getDayActivities(selectedDay).map((activity) => (
                              <Card key={activity.id} className="relative overflow-hidden">
                                {activity.status === "confirmed" && (
                                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">
                                    Confirmed
                                  </div>
                                )}
                                {activity.images && activity.images.length > 0 && (
                                  <div className="h-40 overflow-hidden">
                                    <img src={activity.images[0]} alt={activity.title} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <CardHeader className={activity.images && activity.images.length > 0 ? "pt-3" : ""}>
                                  <div className="flex justify-between items-start">
                                    <CardTitle>{activity.title}</CardTitle>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleConfirmActivity(activity.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                      >
                                        <ChecklistManager className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDeleteActivity(activity.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:text-red-500"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.startTime} - {activity.endTime}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {activity.location}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      ${activity.cost}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {activity.notes && <p className="text-sm text-muted-foreground">{activity.notes}</p>}
                                </CardContent>
                                <CardFooter className="flex justify-between pt-0">
                                  <div className="text-xs text-muted-foreground">
                                    Added by {activity.creatorName}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleActivityVote(activity.id, 'up')}
                                      className="h-8 text-muted-foreground hover:text-green-500"
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      {activity.upvotes}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleActivityVote(activity.id, 'down')}
                                      className="h-8 text-muted-foreground hover:text-red-500"
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                      {activity.downvotes}
                                    </Button>
                                  </div>
                                </CardFooter>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <div className="bg-muted inline-flex items-center justify-center p-4 rounded-full mb-4">
                                <Calendar className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <h3 className="text-lg font-medium mb-2">No Activities Planned</h3>
                              <p className="text-muted-foreground mb-4">
                                There are no activities planned for this day yet.
                              </p>
                              <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Activity
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Trip Members</CardTitle>
                      <CardDescription>
                        People participating in this trip
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {participants.map(participant => (
                        <div key={participant.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              {participant.avatar}
                            </div>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-xs text-muted-foreground">{participant.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            {participant.isCreator && (
                              <Badge variant="outline" className="text-xs">Creator</Badge>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveParticipant(participant.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button className="w-full" variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite People
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Budget Tab Content */}
            <TabsContent value="budget" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                  <BudgetDashboard budgetData={budgetData} />
                </div>
                <div className="lg:col-span-2">
                  <BudgetExpenses expenses={budgetData.expenses} settlements={budgetData.settlements} participants={participants} />
                </div>
                <div>
                  <BudgetAnalytics budgetData={budgetData} />
                </div>
              </div>
            </TabsContent>
            
            {/* Communication Tab Content */}
            <TabsContent value="chat" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TripChat messages={chatData.messages} currentUser={currentUserId} />
                </div>
                <div>
                  <TripPolls polls={chatData.polls} announcements={chatData.announcements} currentUser={currentUserId} />
                </div>
              </div>
            </TabsContent>
            
            {/* Checklist Tab Content */}
            <TabsContent value="checklist" className="space-y-6">
              <ChecklistManager 
                checklistData={mockChecklistData} 
                participants={participants} 
                currentUser={currentUserId}
              />
            </TabsContent>
            
            {/* Documents Tab Content */}
            <TabsContent value="documents" className="space-y-6">
              <DocumentRepository documentData={mockDocumentData} currentUser={currentUserId} />
            </TabsContent>
            
            {/* Travel Info Tab Content */}
            <TabsContent value="info" className="space-y-6">
              <TravelInfo travelInfo={mockTravelInfoData} trip={trip} />
            </TabsContent>
            
            {/* Memories Tab Content */}
            <TabsContent value="memories" className="space-y-6">
              <TripMemories trip={trip} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
