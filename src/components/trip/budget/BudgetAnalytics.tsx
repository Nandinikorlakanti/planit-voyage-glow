
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BudgetCategory = {
  name: string;
  budget: number;
  spent: number;
  color: string;
};

type BudgetAnalyticsProps = {
  budgetData: {
    totalBudget: number;
    spentAmount: number;
    categories: BudgetCategory[];
  };
};

export function BudgetAnalytics({ budgetData }: BudgetAnalyticsProps) {
  const [chartType, setChartType] = useState("pie");
  const [isAnimated, setIsAnimated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 500);
  }, []);
  
  const pieData = budgetData.categories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color
  }));
  
  const barData = budgetData.categories.map(cat => ({
    name: cat.name,
    Spent: cat.spent,
    Budget: cat.budget,
    color: cat.color
  }));
  
  const comparativeData = [
    { name: "Budget", value: budgetData.totalBudget, color: "bg-blue-300" },
    { name: "Actual", value: budgetData.spentAmount, color: "bg-blue-500" }
  ];
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your budget summary is being prepared for download."
    });
    // In a real app, this would generate and download a file
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Budget Analytics</CardTitle>
          <CardDescription>
            Visualize and analyze your spending patterns
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="comparative">Budget vs. Actual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          {chartType === "pie" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isAnimated ? 80 : 0}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color.replace('bg-', '').includes('blue') ? '#3b82f6' : 
                            entry.color.replace('bg-', '').includes('green') ? '#10b981' : 
                            entry.color.replace('bg-', '').includes('orange') ? '#f97316' :
                            entry.color.replace('bg-', '').includes('purple') ? '#8b5cf6' : '#6b7280'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          {chartType === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
                <Bar 
                  dataKey="Budget" 
                  fill="#94a3b8"
                  animationDuration={1000}
                  animationBegin={0}
                  animationEasing="ease-out"
                  isAnimationActive={isAnimated}
                />
                <Bar 
                  dataKey="Spent" 
                  fill="#3b82f6"
                  animationDuration={1000}
                  animationBegin={500}
                  animationEasing="ease-out"
                  isAnimationActive={isAnimated}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {chartType === "comparative" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  animationDuration={1500}
                  animationBegin={0}
                  animationEasing="ease-out"
                  isAnimationActive={isAnimated}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium">Spending Insights</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Largest expense category: <span className="font-medium">Accommodation (64%)</span></li>
            <li>You are <span className="font-medium">under budget</span> by $1,750</li>
            <li>Daily average spending: <span className="font-medium">$312.50</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
