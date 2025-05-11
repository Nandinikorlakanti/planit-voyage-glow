
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type BudgetCategory = {
  name: string;
  budget: number;
  spent: number;
  color: string;
};

type BudgetDashboardProps = {
  budgetData: {
    totalBudget: number;
    spentAmount: number;
    categories: BudgetCategory[];
  };
};

export function BudgetDashboard({ budgetData }: BudgetDashboardProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  // Automatically start animation when component mounts
  useState(() => {
    setTimeout(() => setIsAnimated(true), 100);
  });

  const remainingBudget = budgetData.totalBudget - budgetData.spentAmount;
  const spentPercentage = (budgetData.spentAmount / budgetData.totalBudget) * 100;
  const participantCount = 4; // This would normally come from trip data
  const costPerPerson = budgetData.totalBudget / participantCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Trip Budget</span>
          <Button variant="outline" className="text-sm">
            Edit Budget
          </Button>
        </CardTitle>
        <CardDescription>
          Overview of your trip budget and spending
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main budget progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Budget</span>
            <div className="text-sm font-medium">
              <span className={isAnimated ? "animate-fade-in" : "opacity-0"}>
                ${budgetData.spentAmount.toLocaleString()}
              </span>{" "}
              / ${budgetData.totalBudget.toLocaleString()}
            </div>
          </div>
          <Progress 
            value={isAnimated ? spentPercentage : 0} 
            className="h-3 transition-all duration-1000 ease-out"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              ${remainingBudget.toLocaleString()} remaining
            </span>
            <span>{spentPercentage.toFixed(0)}% spent</span>
          </div>
        </div>

        {/* Per person calculation */}
        <div className="bg-muted p-3 rounded-md flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">Cost per person</h4>
            <p className="text-xs text-muted-foreground">Based on {participantCount} travelers</p>
          </div>
          <div className="text-xl font-bold">
            ${costPerPerson.toFixed(2)}
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Budget Breakdown</h4>
          
          <div className="space-y-3">
            {budgetData.categories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100;
              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <div>
                      <span className={isAnimated ? "animate-fade-in" : "opacity-0"} style={{ animationDelay: `${200 + index * 100}ms` }}>
                        ${category.spent}
                      </span>{" "}
                      / ${category.budget}
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${category.color}`}
                      style={{ 
                        width: isAnimated ? `${percentage}%` : '0%',
                        transitionDelay: `${200 + index * 100}ms`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily spending visualization */}
        <div>
          <h4 className="text-sm font-medium mb-2">Daily Spending</h4>
          <div className="flex items-end h-24 gap-2">
            {/* Example spending bars - this would be dynamic in a real app */}
            <div className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full bg-blue-500 rounded-t-sm transition-all duration-700 ease-out ${isAnimated ? 'h-20' : 'h-0'}`} 
                style={{ transitionDelay: '300ms' }}
              ></div>
              <span className="text-xs mt-1">Day 1</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full bg-blue-500 rounded-t-sm transition-all duration-700 ease-out ${isAnimated ? 'h-10' : 'h-0'}`}
                style={{ transitionDelay: '400ms' }}
              ></div>
              <span className="text-xs mt-1">Day 2</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full bg-blue-500 rounded-t-sm transition-all duration-700 ease-out ${isAnimated ? 'h-16' : 'h-0'}`}
                style={{ transitionDelay: '500ms' }}
              ></div>
              <span className="text-xs mt-1">Day 3</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full bg-blue-500 rounded-t-sm transition-all duration-700 ease-out ${isAnimated ? 'h-5' : 'h-0'}`}
                style={{ transitionDelay: '600ms' }}
              ></div>
              <span className="text-xs mt-1">Day 4</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-500/20 rounded-t-sm h-0"></div>
              <span className="text-xs mt-1">Day 5</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-500/20 rounded-t-sm h-0"></div>
              <span className="text-xs mt-1">Day 6</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-500/20 rounded-t-sm h-0"></div>
              <span className="text-xs mt-1">Day 7</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
