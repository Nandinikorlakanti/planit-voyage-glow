
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, Plus, Search, Users, Check, BarChart, X } from "lucide-react";

type ChecklistItem = {
  id: string;
  text: string;
  assigned: string | 'all';
  completed: string[];
};

type ChecklistCategory = {
  id: string;
  name: string;
  items: ChecklistItem[];
};

type ChecklistData = {
  categories: ChecklistCategory[];
};

type Participant = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isCreator?: boolean;
  isActive?: boolean;
};

type ChecklistManagerProps = {
  checklistData: ChecklistData;
  participants: Participant[];
  currentUser: string;
  className?: string;
};

export function ChecklistManager({ checklistData, participants, currentUser, className }: ChecklistManagerProps) {
  // Add checks for undefined data and provide defaults
  const safeChecklistData = checklistData || { categories: [] };
  
  const [categories, setCategories] = useState(safeChecklistData.categories);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemAssigned, setNewItemAssigned] = useState<string>("all");
  const [newItemCategory, setNewItemCategory] = useState<string>(categories.length > 0 ? categories[0].id : "");
  const [filter, setFilter] = useState<string>("all"); // all, mine, completed, uncompleted
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Calculate completion statistics
  const calculateStats = () => {
    const stats = {
      total: 0,
      completed: 0,
      completionPct: 0,
      assignedToYou: 0,
      completedByYou: 0,
      yourCompletionPct: 0
    };
    
    // Count total items and completed items
    categories.forEach(category => {
      category.items.forEach(item => {
        stats.total++;
        if (item.completed.length > 0) stats.completed++;
        
        // Count items assigned to current user
        if (item.assigned === 'all' || item.assigned === currentUser) {
          stats.assignedToYou++;
          if (item.completed.includes(currentUser)) stats.completedByYou++;
        }
      });
    });
    
    // Calculate percentages (avoid division by zero)
    stats.completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    stats.yourCompletionPct = stats.assignedToYou > 0 ? Math.round((stats.completedByYou / stats.assignedToYou) * 100) : 0;
    
    return stats;
  };

  const stats = calculateStats();

  // Filter and search items
  const getFilteredItems = (categoryItems: ChecklistItem[]) => {
    return categoryItems.filter(item => {
      // Text search
      const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filters
      const matchesFilter = 
        filter === "all" ? true :
        filter === "mine" ? (item.assigned === currentUser || item.assigned === 'all') :
        filter === "completed" ? item.completed.length > 0 :
        filter === "uncompleted" ? item.completed.length === 0 :
        true;
      
      return matchesSearch && matchesFilter;
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the new category.",
        variant: "destructive"
      });
      return;
    }
    
    const newCategory: ChecklistCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      items: []
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsAddCategoryOpen(false);
    
    toast({
      title: "Category added",
      description: `"${newCategoryName}" has been added to your checklist.`
    });
  };
  
  const handleAddItem = () => {
    if (!newItemText.trim() || !newItemCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: newItemText,
      assigned: newItemAssigned,
      completed: []
    };
    
    setCategories(categories.map(cat => {
      if (cat.id === newItemCategory) {
        return {
          ...cat,
          items: [...cat.items, newItem]
        };
      }
      return cat;
    }));
    
    setNewItemText("");
    setNewItemAssigned("all");
    setIsAddItemOpen(false);
    
    toast({
      title: "Item added",
      description: `"${newItemText}" has been added to your checklist.`
    });
  };
  
  const handleToggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => {
            if (item.id === itemId) {
              const userIdx = item.completed.indexOf(currentUser);
              let newCompleted;
              
              if (userIdx >= 0) {
                // Remove user from completed list
                newCompleted = item.completed.filter(id => id !== currentUser);
              } else {
                // Add user to completed list
                newCompleted = [...item.completed, currentUser];
                
                // Show confetti animation if all assignees have completed the item
                const isFullyComplete = item.assigned === 'all'
                  ? newCompleted.length === participants.length
                  : newCompleted.length > 0;
                
                if (isFullyComplete) {
                  // This would trigger a confetti animation in a real app
                  toast({
                    title: "Item completed!",
                    description: `${item.text} has been checked off the list.`
                  });
                }
              }
              
              return {
                ...item,
                completed: newCompleted
              };
            }
            return item;
          })
        };
      }
      return cat;
    }));
  };
  
  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      }
      return cat;
    }));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your checklist."
    });
  };

  const getAssigneeDisplay = (item: ChecklistItem) => {
    if (item.assigned === 'all') {
      return 'Everyone';
    } else {
      const assignee = participants.find(p => p.id === item.assigned);
      return assignee ? assignee.name : 'Unknown';
    }
  };

  return (
    <div className={`grid gap-6 ${className || ""}`}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Packing & To-Do List</CardTitle>
              <CardDescription>
                Track everything you need for your trip
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new category to organize your checklist items.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="category-name" className="text-sm font-medium">
                        Category Name
                      </label>
                      <Input
                        id="category-name"
                        placeholder="e.g. Electronics, Toiletries, Documents"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory}>
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Checklist Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to your trip checklist.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="item-text" className="text-sm font-medium">
                        Item Description
                      </label>
                      <Input
                        id="item-text"
                        placeholder="e.g. Passport, Phone charger"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="item-category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="item-assigned" className="text-sm font-medium">
                        Assigned To
                      </label>
                      <Select value={newItemAssigned} onValueChange={setNewItemAssigned}>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          {participants.map(participant => (
                            <SelectItem key={participant.id} value={participant.id}>
                              {participant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem}>
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Progress summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <ClipboardCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-xl font-bold">{stats.completionPct}%</h3>
                  <p className="text-sm text-muted-foreground">Overall completion</p>
                  <div className="h-2 bg-muted mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${stats.completionPct}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    {stats.completed} of {stats.total} items complete
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-xl font-bold">{stats.yourCompletionPct}%</h3>
                  <p className="text-sm text-muted-foreground">Your completion</p>
                  <div className="h-2 bg-muted mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${stats.yourCompletionPct}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    {stats.completedByYou} of {stats.assignedToYou} items complete
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BarChart className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-xl font-bold">
                    {stats.total > 0 ? `${Math.round((participants.length / stats.total) * 100)}%` : '0%'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Group participation</p>
                  <div className="flex justify-between mt-3">
                    {participants.slice(0, 4).map(participant => (
                      <div 
                        key={participant.id}
                        className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs"
                        title={participant.name}
                      >
                        {participant.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for items..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mine">Assigned to Me</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="uncompleted">Outstanding</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Checklist */}
          <div className="space-y-6">
            {categories.map(category => {
              const filteredItems = getFilteredItems(category.items);
              
              if (filteredItems.length === 0) return null;
              
              return (
                <div key={category.id} className="animate-fade-in">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    {category.name}
                    <Badge variant="outline" className="ml-2">
                      {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                    </Badge>
                  </h3>
                  
                  <div className="space-y-2">
                    {filteredItems.map((item) => {
                      const isCompleted = item.completed.includes(currentUser);
                      const isAssignedToYou = item.assigned === 'all' || item.assigned === currentUser;
                      
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-md border ${isCompleted ? 'bg-muted/30' : 'hover:bg-muted/20'} group transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={item.id}
                              checked={isCompleted}
                              onCheckedChange={() => handleToggleItem(category.id, item.id)}
                              disabled={!isAssignedToYou}
                              className={isCompleted ? "animate-scale-in" : ""}
                            />
                            <div>
                              <label
                                htmlFor={item.id}
                                className={`text-sm font-medium cursor-pointer ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {item.text}
                              </label>
                              <div className="text-xs text-muted-foreground">
                                <span>Assigned to: {getAssigneeDisplay(item)}</span>
                                {item.completed.length > 0 && (
                                  <span className="ml-2">• {item.completed.length} {item.completed.length === 1 ? 'person' : 'people'} completed</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteItem(category.id, item.id)}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {categories.every(cat => getFilteredItems(cat.items).length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No items found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm ? "Try changing your search or filters" : "Add your first item to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

