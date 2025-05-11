
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Info, Plus, ThumbsUp, UserPlus, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type Poll = {
  id: string;
  title: string;
  createdBy: string;
  creatorName: string;
  deadline: string;
  options: Array<{
    id: string;
    text: string;
    votes: string[];
  }>;
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  creatorName: string;
  timestamp: string;
  readBy: string[];
};

type TripPollsProps = {
  polls: Poll[];
  announcements: Announcement[];
  currentUser: string;
};

export function TripPolls({ polls, announcements, currentUser }: TripPollsProps) {
  const [activePolls, setActivePolls] = useState<Poll[]>(polls);
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>(announcements);
  const [isNewPollOpen, setIsNewPollOpen] = useState(false);
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [pollTitle, setPollTitle] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const { toast } = useToast();

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length <= 2) return; // Keep at least 2 options
    const newOptions = [...pollOptions];
    newOptions.splice(index, 1);
    setPollOptions(newOptions);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleCreatePoll = () => {
    if (!pollTitle.trim() || pollOptions.some(opt => !opt.trim())) {
      toast({
        title: "Missing information",
        description: "Please fill in the poll title and all options.",
        variant: "destructive"
      });
      return;
    }

    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      title: pollTitle,
      createdBy: currentUser,
      creatorName: "Jane Smith", // This would normally come from user data
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      options: pollOptions.map((opt, i) => ({
        id: `opt-${i+1}`,
        text: opt,
        votes: []
      }))
    };

    setActivePolls([newPoll, ...activePolls]);
    setPollTitle("");
    setPollOptions(["", ""]);
    setIsNewPollOpen(false);

    toast({
      title: "Poll created",
      description: "Your poll has been shared with all trip participants."
    });
  };

  const handleCreateAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both the title and content.",
        variant: "destructive"
      });
      return;
    }

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: announcementTitle,
      content: announcementContent,
      createdBy: currentUser,
      creatorName: "Jane Smith", // This would normally come from user data
      timestamp: new Date().toISOString(),
      readBy: [currentUser]
    };

    setActiveAnnouncements([newAnnouncement, ...activeAnnouncements]);
    setAnnouncementTitle("");
    setAnnouncementContent("");
    setIsNewAnnouncementOpen(false);

    toast({
      title: "Announcement posted",
      description: "Your announcement has been shared with all trip participants."
    });
  };

  const handleVote = (pollId: string, optionId: string) => {
    setActivePolls(activePolls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(opt => {
            if (opt.id === optionId) {
              // Check if user already voted for this option
              if (opt.votes.includes(currentUser)) {
                return opt; // No change
              } else {
                // Add vote to this option and remove from others
                return {
                  ...opt,
                  votes: [...opt.votes, currentUser]
                };
              }
            } else {
              // Remove user vote from other options in the same poll
              return {
                ...opt,
                votes: opt.votes.filter(userId => userId !== currentUser)
              };
            }
          })
        };
      }
      return poll;
    }));

    toast({
      title: "Vote recorded",
      description: "Your vote has been counted."
    });
  };

  const markAnnouncementAsRead = (announcementId: string) => {
    setActiveAnnouncements(activeAnnouncements.map(ann => {
      if (ann.id === announcementId && !ann.readBy.includes(currentUser)) {
        return {
          ...ann,
          readBy: [...ann.readBy, currentUser]
        };
      }
      return ann;
    }));
  };

  const calculateTimeLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m left`;
    
    return `${minutes}m left`;
  };
  
  const isDeadlineNear = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return diff > 0 && diff < 24 * 60 * 60 * 1000; // Less than 24 hours
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Decisions & Updates</CardTitle>
        <CardDescription>
          Polls, announcements, and important updates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-0">
        <Tabs defaultValue="polls">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="polls" className="flex-1">Polls</TabsTrigger>
            <TabsTrigger value="announcements" className="flex-1">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="polls" className="space-y-4 mt-0">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Active Polls</h3>
              <Dialog open={isNewPollOpen} onOpenChange={setIsNewPollOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> New Poll
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a Poll</DialogTitle>
                    <DialogDescription>
                      Create a new poll to gather input from your travel companions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="poll-title" className="text-sm font-medium">
                        Poll Question
                      </label>
                      <Input
                        id="poll-title"
                        placeholder="e.g. Where should we have dinner?"
                        value={pollTitle}
                        onChange={(e) => setPollTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Options
                      </label>
                      <div className="space-y-2">
                        {pollOptions.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handlePollOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemovePollOption(index)}
                              disabled={pollOptions.length <= 2}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddPollOption}
                          className="w-full mt-2"
                          type="button"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Option
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="deadline" className="text-sm font-medium">
                        Deadline
                      </label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewPollOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePoll}>
                      Create Poll
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {activePolls.length > 0 ? (
              <div className="space-y-4">
                {activePolls.map((poll, pollIndex) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                  const userHasVoted = poll.options.some(opt => opt.votes.includes(currentUser));
                  
                  return (
                    <div 
                      key={poll.id}
                      className="border rounded-lg p-4 animate-fade-in"
                      style={{ animationDelay: `${pollIndex * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{poll.title}</h4>
                        {isDeadlineNear(poll.deadline) ? (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Ending soon
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {calculateTimeLeft(poll.deadline)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {poll.options.map((option, i) => {
                          const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                          const hasVoted = option.votes.includes(currentUser);
                          
                          return (
                            <div key={option.id} className="space-y-1">
                              <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant={hasVoted ? "default" : "outline"} 
                                    size="sm"
                                    className={`h-6 w-6 p-0 rounded-full ${hasVoted ? "animate-scale-in" : ""}`}
                                    onClick={() => handleVote(poll.id, option.id)}
                                  >
                                    {hasVoted ? <CheckCircle2 className="h-3 w-3" /> : <span>{i + 1}</span>}
                                  </Button>
                                  <span>{option.text}</span>
                                </div>
                                <span className="font-medium">{option.votes.length}</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ease-out bg-primary`}
                                  style={{ 
                                    width: `${percentage}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Created by {poll.creatorName}</span>
                        <span>{totalVotes} votes • {userHasVoted ? "You voted" : "Not voted"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No active polls</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a new poll to help make group decisions
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsNewPollOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Poll
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="announcements" className="space-y-4 mt-0">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Trip Announcements</h3>
              <Dialog open={isNewAnnouncementOpen} onOpenChange={setIsNewAnnouncementOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Announcement</DialogTitle>
                    <DialogDescription>
                      Create an important announcement for all trip participants.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="ann-title" className="text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id="ann-title"
                        placeholder="e.g. Flight Schedule Change"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="ann-content" className="text-sm font-medium">
                        Content
                      </label>
                      <Textarea
                        id="ann-content"
                        placeholder="Provide the details of your announcement..."
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        rows={5}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewAnnouncementOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement}>
                      Post Announcement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {activeAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {activeAnnouncements.map((announcement, index) => {
                  const isUnread = !announcement.readBy.includes(currentUser);
                  
                  return (
                    <div 
                      key={announcement.id}
                      className={`border rounded-lg p-4 animate-fade-in ${isUnread ? 'bg-muted/40 border-primary/30' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => markAnnouncementAsRead(announcement.id)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-medium flex items-center">
                          {isUnread && (
                            <span className="h-2 w-2 bg-primary rounded-full mr-2 animate-pulse" />
                          )}
                          {announcement.title}
                        </h4>
                        {isUnread && (
                          <Badge variant="outline" className="text-xs bg-primary text-primary-foreground">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-3 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Posted by {announcement.creatorName}</span>
                        <span>{formatDate(announcement.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No announcements</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Post important updates for your travel group
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsNewAnnouncementOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Announcement
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t mt-4 flex justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Trip starts in 35 days</span>
        </div>
      </CardFooter>
    </Card>
  );
}
