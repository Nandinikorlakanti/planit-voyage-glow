
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Upload, Search, Filter, Calendar, Plus } from "lucide-react";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  paidByName: string;
  split: string;
  splitDetails?: Array<{ userId: string; amount: number }>;
  date: string;
  notes: string;
  receipt: string | null;
};

type Settlement = {
  from: string;
  to: string;
  amount: number;
  fromName: string;
  toName: string;
};

type Participant = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isCreator: boolean;
  isActive: boolean;
  contributionCount: number;
};

type BudgetExpensesProps = {
  expenses: Expense[];
  settlements: Settlement[];
  participants: Participant[];
};

export function BudgetExpenses({ expenses, settlements, participants }: BudgetExpensesProps) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const { toast } = useToast();

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "date-asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "amount-desc") {
      return b.amount - a.amount;
    } else if (sortBy === "amount-asc") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const handleAddExpense = () => {
    toast({
      title: "Expense Added",
      description: "Your expense has been successfully added to the trip.",
    });
    setIsAddExpenseOpen(false);
  };

  const categories = ["Accommodation", "Food", "Activities", "Transportation", "Other"];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              Track and manage trip expenses
            </CardDescription>
          </div>
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Add a new expense to track costs for your trip.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g. Hotel Reservation"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="paidBy" className="text-sm font-medium">
                      Paid By
                    </label>
                    <Select>
                      <SelectTrigger id="paidBy">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {participants.map(participant => (
                            <SelectItem key={participant.id} value={participant.id}>
                              {participant.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="date" className="text-sm font-medium">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="split" className="text-sm font-medium">
                    Split Type
                  </label>
                  <Select defaultValue="equal">
                    <SelectTrigger id="split">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal Split</SelectItem>
                      <SelectItem value="percentage">Percentage Split</SelectItem>
                      <SelectItem value="custom">Custom Amounts</SelectItem>
                    </SelectContent>
                  </Select>
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
                
                <div className="grid gap-2">
                  <label htmlFor="receipt" className="text-sm font-medium">
                    Receipt (optional)
                  </label>
                  <div className="border border-dashed border-input rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or PDF (max. 5MB)
                    </p>
                    <Input
                      id="receipt"
                      type="file"
                      className="hidden"
                      accept="image/*, application/pdf"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddExpense} className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Highest Amount</SelectItem>
                    <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Expenses List */}
            <div className="space-y-3">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="border rounded-lg p-4 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{expense.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${expense.amount}</div>
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-muted-foreground">Paid by:</span>{" "}
                        <span className="font-medium">{expense.paidByName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Split:</span>{" "}
                        <span className="font-medium capitalize">{expense.split}</span>
                      </div>
                    </div>
                    
                    {expense.notes && (
                      <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No expenses found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== "all"
                      ? "Try changing your search or filters"
                      : "Add your first expense to start tracking costs"}
                  </p>
                  {!searchTerm && categoryFilter === "all" && (
                    <Button onClick={() => setIsAddExpenseOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settlements">
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Settlement Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Based on all expenses, here's who owes whom to settle the costs fairly.
                </p>
              </div>
              
              {settlements.length > 0 ? (
                <div className="space-y-3">
                  {settlements.map((settlement, index) => (
                    <div 
                      key={`${settlement.from}-${settlement.to}`}
                      className="border rounded-lg p-4 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                            {settlement.fromName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{settlement.fromName}</span>
                            <span className="text-xs text-muted-foreground">should pay</span>
                          </div>
                        </div>
                        
                        <div className="text-lg font-bold">
                          ${settlement.amount}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span className="font-medium">{settlement.toName}</span>
                            <span className="text-xs text-muted-foreground">to settle up</span>
                          </div>
                          <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                            {settlement.toName.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-center">
                        <Button variant="outline" size="sm">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Mark as Settled
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No settlements needed</h3>
                  <p className="text-sm text-muted-foreground">
                    Everyone is currently squared up with expenses
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
