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
import { formatPrice } from "@workspace/ui/lib/utils";

const chartData = [
  { month: "November", purchases: 2300 },
  { month: "December", purchases: 8750 }, // Holiday spike
  { month: "January", purchases: 1200 },
  { month: "February", purchases: 3450 },
  { month: "March", purchases: 6200 }, // Festival season
  { month: "April", purchases: 2100 },
  { month: "May", purchases: 4800 },
];

const chartConfig = {
  purchases: {
    label: "Purchases",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PurchasesChart() {
  // Get last two months safely with fallbacks
  const lastMonthData =
    chartData.length > 0 ? chartData[chartData.length - 1] : { purchases: 0 };
  const previousMonthData =
    chartData.length > 1 ? chartData[chartData.length - 2] : { purchases: 0 };

  const lastMonth = lastMonthData?.purchases ?? 0;
  const previousMonth = previousMonthData?.purchases ?? 0;

  // Handle division by zero
  const percentChange =
    previousMonth === 0
      ? lastMonth > 0
        ? 100 // If previous was 0 and current is positive, 100% increase
        : 0 // If both are 0, 0% change
      : ((lastMonth - previousMonth) / previousMonth) * 100;

  const isTrendingUp = lastMonth >= previousMonth;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Purchases</CardTitle>
        <CardDescription>
          Your total spending over the last 7 months
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
              domain={["dataMin - 5000", "dataMax + 5000"]}
              tickCount={5}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatPrice(value).split(".")[0] || ""} // Remove decimal part for cleaner Y-axis
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <ChartTooltipContent>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">
                          {data.month}
                        </span>
                        <span>{formatPrice(data.purchases)}</span>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="purchases"
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
                  {percentChange === 0
                    ? "No change from last month"
                    : `Up by ${Math.abs(percentChange).toFixed(1)}% from April`}
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  Down by {Math.abs(percentChange).toFixed(1)}% from April
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              <span className="font-medium">{formatPrice(lastMonth)}</span>{" "}
              total in May
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
