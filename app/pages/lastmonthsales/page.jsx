"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "../../../hooks/use-toast";

const generateChartData = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    data.push({
      month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
      sales: Math.floor(Math.random() * 500) + 100,
    });
  }

  return data;
};

export default function Page() {
  const [chartData, setChartData] = useState([]);
  const [lastMonthSales, setLastMonthSales] = useState("");
  const [lastUpdateDate, setLastUpdateDate] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem("salesChartData");
    const storedUpdateDate = localStorage.getItem("lastUpdateDate");

    if (storedData && storedUpdateDate) {
      setChartData(JSON.parse(storedData));
      setLastUpdateDate(new Date(storedUpdateDate));
    } else {
      const newData = generateChartData();
      setChartData(newData);
      localStorage.setItem("salesChartData", JSON.stringify(newData));
    }
  }, []);

  const updateChart = () => {
    const newSales = parseInt(lastMonthSales);
    if (isNaN(newSales)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number for sales.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date();
    if (
      lastUpdateDate &&
      currentDate.getTime() - new Date(lastUpdateDate).getTime() <
        30 * 24 * 60 * 60 * 1000
    ) {
      const daysUntilNextUpdate = Math.ceil(
        (30 * 24 * 60 * 60 * 1000 -
          (currentDate.getTime() - new Date(lastUpdateDate).getTime())) /
          (24 * 60 * 60 * 1000)
      );
      toast({
        title: "Update not allowed",
        description: `You can only update once every 30 days. Please try again in ${daysUntilNextUpdate} day${
          daysUntilNextUpdate > 1 ? "s" : ""
        }.`,
        variant: "destructive",
      });
      return;
    }

    setChartData((prevData) => {
      const newData = [...prevData];
      newData[newData.length - 1].sales = newSales;
      localStorage.setItem("salesChartData", JSON.stringify(newData));
      return newData;
    });
    setLastUpdateDate(currentDate);
    localStorage.setItem("lastUpdateDate", currentDate.toISOString());
    setLastMonthSales("");
    toast({
      title: "Chart updated",
      description: "The sales data has been successfully updated.",
    });
  };

  const calculateTrend = () => {
    if (chartData.length < 2) return "0.0";
    const lastTwoMonths = chartData.slice(-2);
    const trend =
      ((lastTwoMonths[1].sales - lastTwoMonths[0].sales) /
        lastTwoMonths[0].sales) *
      100;
    return trend.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-lg shadow-md border border-border">
          <p className="font-semibold">{label}</p>
          <p className="text-white">
            Sales: {payload[0].value.toLocaleString()}
          </p>
          {label === chartData[chartData.length - 1]?.month &&
            lastUpdateDate && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(lastUpdateDate).toLocaleString()}
              </p>
            )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl m-auto mt-5 mb-5">
      <CardHeader>
        <CardTitle>Sales Chart</CardTitle>
        <CardDescription>Last 6 Months Sales Data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="number"
            placeholder={`Enter ${
              chartData[chartData.length - 1]?.month || "current"
            } month sales`}
            value={lastMonthSales}
            onChange={(e) => setLastMonthSales(e.target.value)}
            className="w-[200px]"
            aria-label={`Enter ${
              chartData[chartData.length - 1]?.month || "current"
            } month sales`}
          />
          <Button onClick={updateChart}>Update Chart</Button>
        </div>
        <div className="h-[400px] w-full bg-white text-white rounded-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
                tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
                tickFormatter={(value) => value.toLocaleString()}
              />

              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sales"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {parseFloat(calculateTrend()) > 0 ? (
            <>
              Trending up by {calculateTrend()}% this month{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(parseFloat(calculateTrend()))}% this
              month <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
