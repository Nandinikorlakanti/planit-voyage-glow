
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TripProps } from "@/components/trips/TripCard";
import { useToast } from "@/hooks/use-toast";
import { Camera, Download, Heart, Image, MapPin, Plus, Share2, Star, ThumbsUp, Upload } from "lucide-react";

type Activity = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  category: string;
  location: string;
  cost: number;
  notes: string;
  images: string[];
  createdBy: string;
  creatorName: string;
  upvotes: number;
  downvotes: number;
  status: string;
};

type Participant = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isCreator?: boolean;
  isActive?: boolean;
};

type TripMemoriesProps = {
  trip: TripProps;
  activities: Activity[];
  participants: Participant[];
};

export function TripMemories({ trip, activities, participants }: TripMemoriesProps) {
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [activeMemoryTab, setActiveMemoryTab] = useState<'gallery' | 'highlights' | 'favorites'>('gallery');
  const { toast } = useToast();

  // Mock photo gallery data
  const [photos] = useState([
    { id: 'photo-1', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963', caption: 'Sunset in Rome', takenBy: 'Jane Smith', location: 'Trevi Fountain', votes: 5 },
    { id: 'photo-2', url: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8', caption: 'Colosseum Visit', takenBy: 'Alex Rodriguez', location: 'Colosseum', votes: 7 },
    { id: 'photo-3', url: 'https://images.unsplash.com/photo-1529154691717-3306083d869e', caption: 'Perfect Pizza', takenBy: 'Taylor Moore', location: 'Local Restaurant', votes: 4 },
    { id: 'photo-4', url: 'https://images.unsplash.com/photo-1526496604268-f73cb5966a49', caption: 'Vatican Museum', takenBy: 'Alex Rodriguez', location: 'Vatican City', votes: 6 },
    { id: 'photo-5', url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b', caption: 'Roman Forum', takenBy: 'Jane Smith', location: 'Roman Forum', votes: 3 },
    { id: 'photo-6', url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd', caption: 'Gelato Break', takenBy: 'Taylor Moore', location: 'Piazza Navona', votes: 8 },
  ]);

  // Mock trip highlights
  const [highlights] = useState([
    { id: 'hl-1', title: 'First Day in Rome', description: 'Exploring the city center and enjoying our first authentic Italian meal.', photos: ['photo-2', 'photo-6'] },
    { id: 'hl-2', title: 'Best Sunset View', description: 'The sunset from the top of the Spanish Steps was breathtaking.', photos: ['photo-1'] },
    { id: 'hl-3', title: 'Historical Wonders', description: 'The ancient history of the Roman Forum was fascinating.', photos: ['photo-5', 'photo-4'] },
  ]);

  // Mock trip statistics
  const tripStats = {
    totalDistance: 57,
    activitiesCompleted: activities.filter(a => a.status === "confirmed").length,
    photosUploaded: photos.length,
    placesVisited: [...new Set(activities.map(a => a.location))].length,
    favoriteActivity: activities.sort((a, b) => b.upvotes - a.upvotes)[0]?.title || "N/A",
  };

  const handleAddPhoto = () => {
    toast({
      title: "Photo uploaded",
      description: "Your photo has been added to the trip gallery."
    });
    setIsAddPhotoOpen(false);
  };
  
  const handleExportTrip = () => {
    toast({
      title: "Export started",
      description: "Your trip summary is being prepared for download."
    });
  };
  
  const handleLikePhoto = (photoId: string) => {
    toast({
      title: "Photo liked",
      description: "You liked this memory."
    });
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trip Memories</CardTitle>
            <CardDescription>
              Photos, highlights, and memories from your adventure
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Photos</DialogTitle>
                  <DialogDescription>
                    Upload photos from your trip to share with your travel companions.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="border border-dashed border-input rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or HEIC (max. 10MB each)
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="caption" className="text-sm font-medium">
                      Caption (optional)
                    </label>
                    <Input
                      id="caption"
                      placeholder="Add a caption for your photos"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location (optional)
                    </label>
                    <Input
                      id="location"
                      placeholder="Where were these photos taken?"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPhotoOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPhoto}>
                    Upload Photos
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="default" onClick={handleExportTrip}>
              <Download className="mr-2 h-4 w-4" />
              Export Trip
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Trip summary header */}
        <div className="text-center p-6 bg-muted/30 rounded-lg border border-muted">
          <h3 className="text-xl font-bold mb-2">{trip.name}</h3>
          <p className="text-muted-foreground mb-4">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="font-bold text-xl">{tripStats.totalDistance}</div>
              <div className="text-xs text-muted-foreground">km traveled</div>
            </div>
            <div>
              <div className="font-bold text-xl">{tripStats.activitiesCompleted}</div>
              <div className="text-xs text-muted-foreground">activities</div>
            </div>
            <div>
              <div className="font-bold text-xl">{photos.length}</div>
              <div className="text-xs text-muted-foreground">photos</div>
            </div>
            <div>
              <div className="font-bold text-xl">{tripStats.placesVisited}</div>
              <div className="text-xs text-muted-foreground">places visited</div>
            </div>
            <div>
              <div className="font-bold text-xl">{participants.length}</div>
              <div className="text-xs text-muted-foreground">travelers</div>
            </div>
          </div>
        </div>
        
        {/* Memory tabs */}
        <div>
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${activeMemoryTab === 'gallery' ? 'border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveMemoryTab('gallery')}
            >
              Photo Gallery
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${activeMemoryTab === 'highlights' ? 'border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveMemoryTab('highlights')}
            >
              Trip Highlights
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${activeMemoryTab === 'favorites' ? 'border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveMemoryTab('favorites')}
            >
              Favorite Moments
            </button>
          </div>
          
          {/* Gallery Tab */}
          {activeMemoryTab === 'gallery' && (
            <div className="py-6 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id}
                    className="group relative overflow-hidden rounded-md border cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img
                      src={`${photo.url}?q=80&w=400&auto=format&fit=crop`}
                      alt={photo.caption}
                      className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <h4 className="text-white text-sm font-medium">{photo.caption}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center text-xs text-white/80">
                          <MapPin className="h-3 w-3 mr-1" />
                          {photo.location}
                        </div>
                        <button 
                          className="text-white/90 hover:text-white"
                          onClick={() => handleLikePhoto(photo.id)}
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {photo.votes > 5 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary">
                          <Star className="h-3 w-3 mr-1" /> Top Photo
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  className="flex flex-col items-center justify-center border rounded-md p-6 h-full aspect-square text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
                  onClick={() => setIsAddPhotoOpen(true)}
                  style={{ animationDelay: `${photos.length * 100}ms` }}
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Add Photos</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Highlights Tab */}
          {activeMemoryTab === 'highlights' && (
            <div className="py-6 space-y-6 animate-fade-in">
              {highlights.map((highlight, index) => {
                const highlightPhotos = photos.filter(p => highlight.photos.includes(p.id));
                
                return (
                  <div 
                    key={highlight.id}
                    className="border rounded-lg overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-1">{highlight.title}</h3>
                      <p className="text-muted-foreground mb-3">{highlight.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {highlightPhotos.map(photo => (
                          <div key={photo.id} className="relative rounded-md overflow-hidden">
                            <img
                              src={`${photo.url}?q=80&w=600&auto=format&fit=crop`}
                              alt={photo.caption}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2 text-sm">
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-2 bg-muted/30 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {highlightPhotos.length} photos
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Favorite
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-center">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Highlight
                </Button>
              </div>
            </div>
          )}
          
          {/* Favorites Tab */}
          {activeMemoryTab === 'favorites' && (
            <div className="py-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Trip Favorites</h3>
                <p className="text-muted-foreground mb-4">
                  The most memorable moments from your trip as voted by your travel companions.
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-amber-500">1</Badge>
                      <h4 className="font-medium">Favorite Activity</h4>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-md overflow-hidden w-32 h-32 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=300&auto=format&fit=crop"
                          alt="Colosseum"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-lg">Visit the Colosseum</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          Our guided tour of the ancient Colosseum was the highlight of the trip!
                        </p>
                        <div className="flex items-center text-sm">
                          <ThumbsUp className="h-4 w-4 text-primary mr-1" />
                          <span>Voted by 3 travelers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-zinc-400">2</Badge>
                      <h4 className="font-medium">Favorite Restaurant</h4>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-md overflow-hidden w-32 h-32 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300&auto=format&fit=crop"
                          alt="Pizza"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-lg">Da Giovanni Restaurant</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          The best authentic pizza we had during the entire trip!
                        </p>
                        <div className="flex items-center text-sm">
                          <ThumbsUp className="h-4 w-4 text-primary mr-1" />
                          <span>Voted by 2 travelers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-amber-700">3</Badge>
                      <h4 className="font-medium">Most Beautiful Spot</h4>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-md overflow-hidden w-32 h-32 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=300&auto=format&fit=crop"
                          alt="View"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-lg">Sunset at Trevi Fountain</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          The lighting and atmosphere were absolutely magical!
                        </p>
                        <div className="flex items-center text-sm">
                          <ThumbsUp className="h-4 w-4 text-primary mr-1" />
                          <span>Voted by 2 travelers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
