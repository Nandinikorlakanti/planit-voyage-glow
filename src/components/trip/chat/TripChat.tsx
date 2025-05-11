
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions: Array<{
    type: string;
    users: string[];
  }>;
  attachments: Array<{
    id: string;
    type: string;
    url: string;
    name: string;
  }>;
};

type Participant = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isCreator?: boolean;
  isActive?: boolean;
};

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

type TripChatProps = {
  chatData: {
    messages: Message[];
    polls?: Poll[];
    announcements?: Announcement[];
  };
  currentUser: string;
  participants: Participant[];
};

export function TripChat({ chatData, currentUser, participants }: TripChatProps) {
  const [messages, setMessages] = useState<Message[]>(chatData.messages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser,
      userName: participants.find(p => p.id === currentUser)?.name || "You",
      avatar: participants.find(p => p.id === currentUser)?.avatar || "??",
      content: inputValue,
      timestamp: new Date().toISOString(),
      reactions: [],
      attachments: []
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate someone typing back after a short delay
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Add a response message
        const responseMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          userId: "user-2",
          userName: "Alex Rodriguez",
          avatar: "AR",
          content: "Thanks for the update!",
          timestamp: new Date().toISOString(),
          reactions: [],
          attachments: []
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
        toast({
          title: "New Message",
          description: `${responseMessage.userName} responded to your message.`
        });
      }, 3000);
    }, 1500);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReactionIndex = msg.reactions.findIndex(r => r.type === reaction);
        
        if (existingReactionIndex >= 0) {
          // User already reacted with this emoji
          const userIndex = msg.reactions[existingReactionIndex].users.indexOf(currentUser);
          
          if (userIndex >= 0) {
            // Remove user from existing reaction
            const updatedUsers = [...msg.reactions[existingReactionIndex].users];
            updatedUsers.splice(userIndex, 1);
            
            const updatedReactions = [...msg.reactions];
            
            if (updatedUsers.length === 0) {
              // Remove reaction entirely if no users left
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              // Update users for this reaction
              updatedReactions[existingReactionIndex] = {
                ...updatedReactions[existingReactionIndex],
                users: updatedUsers
              };
            }
            
            return { ...msg, reactions: updatedReactions };
          } else {
            // Add user to existing reaction
            return {
              ...msg,
              reactions: msg.reactions.map((r, i) => 
                i === existingReactionIndex 
                  ? { ...r, users: [...r.users, currentUser] } 
                  : r
              )
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { type: reaction, users: [currentUser] }]
          };
        }
      }
      return msg;
    }));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getMessageGroups = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length) {
          groups.push({
            date: currentDate,
            messages: currentGroup
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length) {
      groups.push({
        date: currentDate,
        messages: currentGroup
      });
    }

    return groups;
  };

  const emojiReactions = ["👍", "❤️", "😂", "😮", "🎉"];

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>Trip Chat</CardTitle>
        <CardDescription>
          Chat with your travel companions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6">
          {getMessageGroups().map((group, groupIndex) => (
            <div key={group.date} className="space-y-4">
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-background">
                  {formatDate(group.messages[0].timestamp)}
                </Badge>
              </div>
              
              {group.messages.map((message, messageIndex) => {
                const isCurrentUser = message.userId === currentUser;
                const showAvatar = messageIndex === 0 || group.messages[messageIndex - 1].userId !== message.userId;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[80%]`}>
                      {/* Avatar */}
                      {!isCurrentUser && showAvatar && (
                        <div 
                          className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium mt-1"
                          title={message.userName}
                        >
                          {message.avatar}
                        </div>
                      )}
                      
                      {/* Message content */}
                      <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                        {/* Username */}
                        {showAvatar && !isCurrentUser && (
                          <span className="text-xs font-medium">{message.userName}</span>
                        )}
                        
                        {/* Message bubble */}
                        <div 
                          className={`rounded-lg px-3 py-2 whitespace-pre-wrap animate-fade-in ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground rounded-br-none' 
                              : 'bg-muted rounded-bl-none'
                          }`}
                          style={{ 
                            animationDelay: `${(groupIndex * 100) + (messageIndex * 50)}ms`,
                            maxWidth: 'fit-content' 
                          }}
                        >
                          {message.content}
                          
                          {/* Attachments */}
                          {message.attachments.map(attachment => (
                            <div key={attachment.id} className="mt-2">
                              {attachment.type === 'image' ? (
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.name} 
                                  className="rounded max-h-40 w-auto"
                                />
                              ) : (
                                <div className="bg-background/50 rounded p-2 text-xs flex items-center">
                                  <span className="mr-2">📎</span> {attachment.name}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                        
                        {/* Reactions */}
                        {message.reactions.length > 0 && (
                          <div className={`flex gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {message.reactions.map((reaction) => (
                              <div 
                                key={reaction.type} 
                                className={`text-xs bg-background rounded-full px-1.5 py-0.5 border flex items-center
                                  ${reaction.users.includes(currentUser) ? 'border-primary' : 'border-muted'}`}
                                onClick={() => handleReaction(message.id, reaction.type)}
                              >
                                <span className="mr-1">{reaction.type}</span>
                                <span>{reaction.users.length}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Reaction selector (hidden by default) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex ml-2">
                        {emojiReactions.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="p-1 hover:bg-muted rounded-full"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                AR
              </div>
              <div className="bg-muted rounded-lg px-4 py-2 flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "300ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "600ms" }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Smile className="h-4 w-4" />
          </Button>
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
