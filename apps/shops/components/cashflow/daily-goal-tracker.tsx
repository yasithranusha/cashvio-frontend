import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { Clock, Target } from "lucide-react";

interface DailyGoalTrackerProps {
  dailyTarget: number;
  dailyProgress: number;
  daysUntilNextPayment: number;
  formatCurrency: (amount: number) => string;
}

export function DailyGoalTracker({
  dailyTarget,
  dailyProgress,
  daysUntilNextPayment,
  formatCurrency,
}: DailyGoalTrackerProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Daily Cash Flow Goal
        </CardTitle>
        <CardDescription>
          Track your progress toward meeting upcoming payment obligations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium">Daily Target</div>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyTarget)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Today's Progress</div>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyTarget * (dailyProgress / 100))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Remaining</div>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  dailyTarget - dailyTarget * (dailyProgress / 100)
                )}
              </div>
            </div>
          </div>
          <Progress value={dailyProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>{dailyProgress}% Complete</div>
            <div>Daily Goal: {formatCurrency(dailyTarget)}</div>
          </div>

          <div className="flex items-center justify-center mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Next payment due in {daysUntilNextPayment} days</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
