
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/services/api";
import { BarChart2, Calendar, Clock, Leaf } from "lucide-react";

interface Calculation {
  _id: string;
  date: string;
  result: {
    total: number;
    breakdown: {
      transport: { emissions: number; percentage: number };
      electricity: { emissions: number; percentage: number };
      waste: { emissions: number; percentage: number };
      food: { emissions: number; percentage: number };
    };
  };
}

const Dashboard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchCalculations = async () => {
      try {
        const response = await api.calculator.getUserCalculations();
        
        // Process responses from localStorage format to our application format
        if (Array.isArray(response)) {
          // Transform the data into the expected format
          const formattedCalculations = response.map((calc) => {
            // Check if the calculation has the expected structure
            if (!calc || !calc.result_data) {
              console.warn("Skipping invalid calculation:", calc);
              return null;
            }
            
            return {
              _id: calc._id || calc.user_id || Math.random().toString(36).substring(2, 15),
              date: calc.created_at || new Date().toISOString(),
              result: calc.result_data
            };
          }).filter(calc => calc !== null) as Calculation[];
          
          setCalculations(formattedCalculations);
          console.log("Formatted calculations:", formattedCalculations);
        } else {
          console.warn("Expected array response from getUserCalculations, got:", response);
          setCalculations([]);
        }
      } catch (error) {
        console.error("Error fetching calculations:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your calculation history",
        });
        // Ensure calculations is at least an empty array on error
        setCalculations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalculations();
  }, [isAuthenticated, navigate, toast]);

  // Use mock data only if there are no actual calculations
  const mockCalculations = [
    {
      _id: "1",
      date: "2025-04-01T12:00:00.000Z",
      result: {
        total: 520,
        breakdown: {
          transport: { emissions: 210, percentage: 40 },
          electricity: { emissions: 150, percentage: 29 },
          waste: { emissions: 80, percentage: 15 },
          food: { emissions: 80, percentage: 16 },
        },
      },
    },
    {
      _id: "2",
      date: "2025-03-15T12:00:00.000Z",
      result: {
        total: 600,
        breakdown: {
          transport: { emissions: 250, percentage: 42 },
          electricity: { emissions: 180, percentage: 30 },
          waste: { emissions: 90, percentage: 15 },
          food: { emissions: 80, percentage: 13 },
        },
      },
    },
    {
      _id: "3",
      date: "2025-03-01T12:00:00.000Z",
      result: {
        total: 650,
        breakdown: {
          transport: { emissions: 280, percentage: 43 },
          electricity: { emissions: 200, percentage: 31 },
          waste: { emissions: 90, percentage: 14 },
          food: { emissions: 80, percentage: 12 },
        },
      },
    },
    {
      _id: "4",
      date: "2025-02-15T12:00:00.000Z",
      result: {
        total: 680,
        breakdown: {
          transport: { emissions: 300, percentage: 44 },
          electricity: { emissions: 210, percentage: 31 },
          waste: { emissions: 95, percentage: 14 },
          food: { emissions: 75, percentage: 11 },
        },
      },
    },
  ];

  // Only use mock data if there are no actual calculations
  const displayCalculations = calculations.length > 0 ? calculations : mockCalculations;

  // Ensure we have valid calculations before proceeding
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl text-eco-neutral-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Sort calculations by date (newest first)
  const sortedCalculations = [...displayCalculations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Safely prepare data for trend chart (oldest to newest)
  const trendData = [...sortedCalculations]
    .reverse()
    .map((calc) => {
      // Make sure calc and calc.result exists before accessing properties
      if (!calc || !calc.result) {
        console.warn("Invalid calculation data found:", calc);
        return null;
      }
      
      return {
        date: new Date(calc.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        total: calc.result.total || 0,
        transport: calc.result.breakdown?.transport?.emissions || 0,
        electricity: calc.result.breakdown?.electricity?.emissions || 0,
        waste: calc.result.breakdown?.waste?.emissions || 0,
        food: calc.result.breakdown?.food?.emissions || 0,
      };
    })
    .filter(item => item !== null); // Remove any null items

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return "Invalid time";
    }
  };

  // Calculate average footprint - safely handling possible undefined values
  const calculateAverage = () => {
    if (displayCalculations.length === 0) return 0;
    
    let sum = 0;
    let validCount = 0;
    
    for (const calc of displayCalculations) {
      if (calc?.result?.total != null) {
        sum += calc.result.total;
        validCount++;
      }
    }
    
    return validCount > 0 ? sum / validCount : 0;
  };

  // Get latest footprint - safely handling possible undefined values
  const getLatestFootprint = () => {
    if (displayCalculations.length === 0) return 0;
    
    // Find the first valid calculation with a total
    for (const calc of sortedCalculations) {
      if (calc?.result?.total != null) {
        return calc.result.total;
      }
    }
    return 0;
  };

  const userName = user?.name || "User";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-eco-neutral-700">
              {userName}'s Dashboard
            </h1>
            <p className="text-eco-neutral-500 mt-1">
              Track your carbon footprint and progress over time
            </p>
          </div>
          <Button className="mt-4 md:mt-0 eco-gradient" asChild>
            <Link to="/calculator">Calculate New Footprint</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-eco-green-100 p-3 rounded-full">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-eco-neutral-500 text-sm">Latest Footprint</p>
                  <h3 className="text-3xl font-bold text-eco-neutral-700">
                    {getLatestFootprint()} kg
                  </h3>
                  <p className="text-xs text-eco-neutral-500 mt-1">CO₂e per month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-eco-blue-100 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-eco-blue-500" />
                </div>
                <div>
                  <p className="text-eco-neutral-500 text-sm">Average Footprint</p>
                  <h3 className="text-3xl font-bold text-eco-neutral-700">
                    {calculateAverage().toFixed(1)} kg
                  </h3>
                  <p className="text-xs text-eco-neutral-500 mt-1">CO₂e per month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-eco-green-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-eco-neutral-500 text-sm">Total Calculations</p>
                  <h3 className="text-3xl font-bold text-eco-neutral-700">
                    {displayCalculations.length}
                  </h3>
                  <p className="text-xs text-eco-neutral-500 mt-1">
                    {displayCalculations.length === 1
                      ? "calculation"
                      : "calculations"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {trendData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mb-10">
            <Card className="eco-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-eco-neutral-700 mb-4">
                  Carbon Footprint Trend
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kg" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Total Emissions"
                        stackId="1"
                        stroke="#22C55E"
                        fill="#22C55E"
                        fillOpacity={0.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="transport"
                        name="Transport"
                        stackId="2"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="electricity"
                        name="Electricity"
                        stackId="2"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                        fillOpacity={0.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="waste"
                        name="Waste"
                        stackId="2"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="food"
                        name="Food"
                        stackId="2"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center mb-10">
            <Card className="eco-card p-6">
              <p className="text-eco-neutral-500">No trend data available yet. Complete calculations to see your trends.</p>
            </Card>
          </div>
        )}

        <Card className="eco-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-eco-neutral-700 mb-4">
              Calculation History
            </h2>
            {sortedCalculations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="text-right">Total Emissions (kg CO₂e)</TableHead>
                      <TableHead className="text-right">Transport</TableHead>
                      <TableHead className="text-right">Electricity</TableHead>
                      <TableHead className="text-right">Waste</TableHead>
                      <TableHead className="text-right">Food</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCalculations.map((calc) => {
                      // Ensure calc and calc.result exists before rendering
                      if (!calc || !calc.result) {
                        return null;
                      }
                      
                      return (
                        <TableRow key={calc._id}>
                          <TableCell className="font-medium">
                            {formatDate(calc.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-eco-neutral-500" />
                              {formatTime(calc.date)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {calc.result.total || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {calc.result.breakdown?.transport?.emissions || 0} (
                            {calc.result.breakdown?.transport?.percentage || 0}%)
                          </TableCell>
                          <TableCell className="text-right">
                            {calc.result.breakdown?.electricity?.emissions || 0} (
                            {calc.result.breakdown?.electricity?.percentage || 0}%)
                          </TableCell>
                          <TableCell className="text-right">
                            {calc.result.breakdown?.waste?.emissions || 0} (
                            {calc.result.breakdown?.waste?.percentage || 0}%)
                          </TableCell>
                          <TableCell className="text-right">
                            {calc.result.breakdown?.food?.emissions || 0} (
                            {calc.result.breakdown?.food?.percentage || 0}%)
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-eco-neutral-500">No calculation history available yet.</p>
                <Button className="mt-4 eco-gradient" asChild>
                  <Link to="/calculator">Calculate Your First Footprint</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
