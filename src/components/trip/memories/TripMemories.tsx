
import React, { useState } from "react";
import { TripProps } from "@/components/trips/TripCard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle, Camera, Upload, Share, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TripMemoriesProps = {
  trip: TripProps;
};

// Mock data for memories
const mockMemories = [
  { 
    id: "mem-1", 
    title: "Sunset at the Colosseum",
    description: "Beautiful sunset we captured during our evening walk",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop",
    date: "2025-06-16",
    location: "Rome, Italy",
    addedBy: "Jane Smith",
    likes: 3
  },
  { 
    id: "mem-2", 
    title: "Pizza Making Class",
    description: "Learning to make authentic Italian pizza from the experts",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop",
    date: "2025-06-17",
    location: "Rome, Italy",
    addedBy: "Alex Rodriguez",
    likes: 2
  },
  { 
    id: "mem-3", 
    title: "Vatican Museums",
    description: "The amazing ceiling of the Sistine Chapel",
    image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1600&auto=format&fit=crop",
    date: "2025-06-18",
    location: "Vatican City",
    addedBy: "Jane Smith",
    likes: 4
  },
  { 
    id: "mem-4", 
    title: "Trevi Fountain Wishes",
    description: "Making wishes at the Trevi Fountain",
    image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=1600&auto=format&fit=crop",
    date: "2025-06-19",
    location: "Rome, Italy",
    addedBy: "Taylor Moore",
    likes: 3
  },
];

export function TripMemories({ trip }: TripMemoriesProps) {
  const [activeTab, setActiveTab] = useState("gallery");
  const [memories, setMemories] = useState(mockMemories);
  const { toast } = useToast();
  
  const handleLike = (memoryId: string) => {
    setMemories(memories.map(memory => 
      memory.id === memoryId 
        ? { ...memory, likes: memory.likes + 1 } 
        : memory
    ));
    
    toast({
      title: "Memory liked!",
      description: "You liked this memory.",
    });
  };
  
  const handleUpload = () => {
    toast({
      title: "Upload started",
      description: "Your photos are being uploaded...",
    });
    
    // Simulate upload completion
    setTimeout(() => {
      toast({
        title: "Upload complete",
        description: "Your photos have been uploaded successfully!",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trip Memories</h2>
          <p className="text-muted-foreground">Capture and share your favorite moments from {trip.name}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
          <Button variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="gallery" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="map">Location Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search memories..."
              className="max-w-xs"
            />
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Sort by Date
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((memory) => (
              <Card key={memory.id} className="overflow-hidden group">
                <div className="relative">
                  <AspectRatio ratio={4/3}>
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-medium">{memory.title}</p>
                    <p className="text-sm text-white/80">{memory.date} • {memory.location}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full" onClick={() => handleLike(memory.id)}>
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardFooter className="flex justify-between p-3">
                  <div className="text-xs text-muted-foreground">
                    Added by {memory.addedBy}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <Heart className="h-4 w-4" fill="currentColor" />
                      <span className="ml-1 text-xs">{memory.likes}</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center min-h-[240px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted mb-3 p-3">
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">Add New Memory</p>
                <p className="text-xs text-muted-foreground text-center">
                  Upload photos or videos from your trip
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="min-h-[300px] flex items-center justify-center text-center p-12">
          <div>
            <p className="text-muted-foreground mb-2">Timeline view coming soon</p>
            <Button variant="outline">Get notified when available</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="map" className="min-h-[300px] flex items-center justify-center text-center p-12">
          <div>
            <p className="text-muted-foreground mb-2">Location map coming soon</p>
            <Button variant="outline">Get notified when available</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
