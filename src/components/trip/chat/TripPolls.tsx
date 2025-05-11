
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Check, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the types for the component props
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
  const [activePolls, setActivePolls] = useState(polls);
  const [readAnnouncements, setReadAnnouncements] = useState<string[]>([]);
  const { toast } = useToast();

  const handleVote = (pollId: string, optionId: string) => {
    setActivePolls(activePolls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id === optionId) {
              // Check if user already voted for this option
              if (option.votes.includes(currentUser)) {
                return option;
              }
              
              // Add vote to this option
              return {
                ...option,
                votes: [...option.votes, currentUser]
              };
            } else {
              // Remove user vote from other options in this poll
              return {
                ...option,
                votes: option.votes.filter(userId => userId !== currentUser)
              };
            }
          })
        };
      }
      return poll;
    }));

    toast({
      title: "Vote recorded",
      description: "Your vote has been saved."
    });
  };

  const markAnnouncementAsRead = (announcementId: string) => {
    setReadAnnouncements(prev => [...prev, announcementId]);
    
    toast({
      title: "Marked as read",
      description: "Announcement marked as read."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Check if poll is expired
  const isPollExpired = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  // Check if user has voted in a poll
  const hasVoted = (poll: Poll) => {
    return poll.options.some(option => option.votes.includes(currentUser));
  };

  // Get total votes for a poll
  const getTotalVotes = (poll: Poll) => {
    return poll.options.reduce((total, option) => total + option.votes.length, 0);
  };

  // Calculate percentage for option
  const getVotePercentage = (votes: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Polls Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Polls</CardTitle>
            <CardDescription>Vote on group decisions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Poll
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {activePolls.length > 0 ? (
            activePolls.map(poll => {
              const totalVotes = getTotalVotes(poll);
              const expired = isPollExpired(poll.deadline);
              const userVoted = hasVoted(poll);
              
              return (
                <div key={poll.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{poll.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Created by {poll.creatorName}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {expired ? "Expired" : `Ends ${formatDate(poll.deadline)}`}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {poll.options.map(option => {
                      const voteCount = option.votes.length;
                      const percentage = getVotePercentage(voteCount, totalVotes);
                      const isUserVote = option.votes.includes(currentUser);
                      
                      return (
                        <div 
                          key={option.id} 
                          className={`relative rounded-lg border p-3 transition-colors ${
                            isUserVote 
                              ? 'bg-primary/10 border-primary/30' 
                              : 'hover:bg-muted/50'
                          } ${expired ? 'opacity-80' : ''}`}
                          onClick={() => !expired && handleVote(poll.id, option.id)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              {isUserVote && (
                                <Check className="h-4 w-4 text-primary mr-2" />
                              )}
                              <span className={isUserVote ? "font-medium" : ""}>
                                {option.text}
                              </span>
                            </div>
                            <span className="text-sm">
                              {voteCount} {voteCount === 1 ? "vote" : "votes"}
                            </span>
                          </div>
                          
                          <Progress 
                            value={percentage} 
                            className={`h-2 ${isUserVote ? 'bg-primary/20' : 'bg-muted'}`}
                          />
                          
                          <span className="text-xs text-muted-foreground absolute right-3 -bottom-1">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span>{totalVotes} total votes</span>
                    {!userVoted && !expired && (
                      <span className="text-primary">Click an option to vote</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No active polls</p>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a new poll
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Announcements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Announcements</CardTitle>
          <CardDescription>Important updates for the trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map(announcement => {
              const isRead = announcement.readBy.includes(currentUser) || 
                             readAnnouncements.includes(announcement.id);
              
              return (
                <div 
                  key={announcement.id} 
                  className={`border rounded-lg p-4 ${!isRead ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium flex items-center">
                        {!isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                        )}
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        By {announcement.creatorName} • {formatDate(announcement.timestamp)}
                      </p>
                    </div>
                    {!isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAnnouncementAsRead(announcement.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{announcement.content}</p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No announcements yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
