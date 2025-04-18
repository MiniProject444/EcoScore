
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
        setIsLoading(true);
        console.log("Fetching calculations for user:", user?.id, user?.name);
        const response = await api.calculator.getUserCalculations();
        
        console.log("Raw response from getUserCalculations:", response);
        
        if (Array.isArray(response)) {
          const formattedCalculations = response
            .map((calc) => {
              if (!calc || !calc.result_data || typeof calc.result_data.total !== 'number') {
                console.warn("Skipping invalid calculation:", calc);
                return null;
              }
              
              return {
                _id: calc._id,
                date: calc.created_at,
                result: calc.result_data
              };
            })
            .filter((calc): calc is Calculation => calc !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          console.log("Formatted user calculations:", formattedCalculations);
          setCalculations(formattedCalculations);
        } else if (response && typeof response === 'object' && 'message' in response) {
          console.warn("API returned a message instead of calculations:", response);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your calculation history from API",
          });
          setCalculations([]);
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
        setCalculations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchCalculations();
    }
  }, [isAuthenticated, navigate, toast, user]);

  // Safely prepare data for trend chart (oldest to newest)
  const trendData = [...calculations]
    .reverse()
    .map((calc) => {
      if (!calc?.result) {
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
    .filter(item => item !== null);

  // Calculate average footprint
  const calculateAverage = () => {
    if (calculations.length === 0) return 0;
    
    const total = calculations.reduce((sum, calc) => {
      return sum + (calc.result?.total || 0);
    }, 0);
    
    return Number((total / calculations.length).toFixed(1));
  };

  // Get latest footprint
  const getLatestFootprint = () => {
    return calculations.length > 0 ? calculations[0]?.result?.total || 0 : 0;
  };

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

  const userName = user?.name || "User";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-eco-neutral-700">
              {user?.name || "User"}'s Dashboard
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
                    {calculateAverage()} kg
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
                    {calculations.length}
                  </h3>
                  <p className="text-xs text-eco-neutral-500 mt-1">
                    {calculations.length === 1
                      ? "calculation"
                      : "calculations"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card className="eco-card p-6 mb-10">
            <p className="text-center text-eco-neutral-500">Loading your calculation data...</p>
          </Card>
        ) : calculations.length > 0 ? (
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
              <Button className="mt-4 eco-gradient" asChild>
                <Link to="/calculator">Calculate Your First Footprint</Link>
              </Button>
            </Card>
          </div>
        )}

        <Card className="eco-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-eco-neutral-700 mb-4">
              Calculation History
            </h2>
            {isLoading ? (
              <p className="text-center py-6 text-eco-neutral-500">Loading your calculation history...</p>
            ) : calculations.length > 0 ? (
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
                    {calculations.map((calc) => (
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
                          {calc.result.total}
                        </TableCell>
                        <TableCell className="text-right">
                          {calc.result.breakdown?.transport?.emissions} (
                          {calc.result.breakdown?.transport?.percentage}%)
                        </TableCell>
                        <TableCell className="text-right">
                          {calc.result.breakdown?.electricity?.emissions} (
                          {calc.result.breakdown?.electricity?.percentage}%)
                        </TableCell>
                        <TableCell className="text-right">
                          {calc.result.breakdown?.waste?.emissions} (
                          {calc.result.breakdown?.waste?.percentage}%)
                        </TableCell>
                        <TableCell className="text-right">
                          {calc.result.breakdown?.food?.emissions} (
                          {calc.result.breakdown?.food?.percentage}%)
                        </TableCell>
                      </TableRow>
                    ))}
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
