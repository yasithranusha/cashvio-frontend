"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";

// Updated data with lower user registration numbers
const chartData = [
  { month: "November", users: 1 },
  { month: "December", users: 2 },
  { month: "January", users: 0 },
  { month: "February", users: 3 },
  { month: "March", users: 1 },
  { month: "April", users: 0 },
  { month: "May", users: 2 },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function UsersChart() {
  // Get last two months safely with fallbacks
  const lastMonthData = chartData.length > 0 ? chartData[chartData.length - 1] : { users: 0 };
  const previousMonthData = chartData.length > 1 ? chartData[chartData.length - 2] : { users: 0 };
  
  const lastMonth = lastMonthData?.users ?? 0;
  const previousMonth = previousMonthData?.users ?? 0;
  
  // Handle division by zero
  const percentChange = previousMonth === 0 
    ? lastMonth > 0 
      ? 100  // If previous was 0 and current is positive, 100% increase
      : 0    // If both are 0, 0% change
    : ((lastMonth - previousMonth) / previousMonth) * 100;
  
  const isTrendingUp = lastMonth >= previousMonth;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Registrations</CardTitle>
        <CardDescription>
          New user sign-ups over the last 7 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              domain={[0, 'dataMax + 1']} 
              tickCount={4} 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="users"
              type="monotone"
              fill="var(--chart-1)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isTrendingUp ? (
                <>
                  {percentChange === 0 ? 
                    "No change from last month" : 
                    `Trending up by ${Math.abs(percentChange).toFixed(1)}% this month`
                  }
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  Trending down by {Math.abs(percentChange).toFixed(1)}% this month
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              November 2023 - May 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}