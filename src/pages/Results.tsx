import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuthStore } from "@/stores/authStore";
import { Lightbulb, BarChart3, ArrowLeft, Share2, Download, UserPlus } from "lucide-react";
import { downloadCalculationResults } from "@/utils/downloadUtils";
import { toast } from "@/components/ui/use-toast";
import ShareCard from "@/components/ShareCard";

interface Breakdown {
  transport: { emissions: number; percentage: number };
  electricity: { emissions: number; percentage: number };
  waste: { emissions: number; percentage: number };
  food: { emissions: number; percentage: number };
}

interface CalculationResult {
  total: number;
  breakdown: Breakdown;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    if (location.state?.result) {
      const validResult = {
        total: location.state.result.total || 0,
        breakdown: {
          transport: location.state.result.breakdown?.transport || { emissions: 0, percentage: 0 },
          electricity: location.state.result.breakdown?.electricity || { emissions: 0, percentage: 0 },
          waste: location.state.result.breakdown?.waste || { emissions: 0, percentage: 0 },
          food: location.state.result.breakdown?.food || { emissions: 0, percentage: 0 }
        }
      };
      setResult(validResult);
    } else {
      navigate("/calculator");
    }
  }, [location.state, navigate]);

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-eco-neutral-500">Loading results...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "Transport", value: result.breakdown.transport.emissions },
    { name: "Electricity", value: result.breakdown.electricity.emissions },
    { name: "Waste", value: result.breakdown.waste.emissions },
    { name: "Food", value: result.breakdown.food.emissions },
  ];

  const barData = [
    {
      name: "Transport",
      emissions: result.breakdown.transport.emissions,
      percentage: result.breakdown.transport.percentage,
    },
    {
      name: "Electricity",
      emissions: result.breakdown.electricity.emissions,
      percentage: result.breakdown.electricity.percentage,
    },
    {
      name: "Waste",
      emissions: result.breakdown.waste.emissions,
      percentage: result.breakdown.waste.percentage,
    },
    {
      name: "Food",
      emissions: result.breakdown.food.emissions,
      percentage: result.breakdown.food.percentage,
    },
  ];

  const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"];

  const getTopEmissionCategories = () => {
    if (!result) return [];
    
    const categories = [
      { name: "transport", value: result.breakdown.transport.emissions },
      { name: "electricity", value: result.breakdown.electricity.emissions },
      { name: "waste", value: result.breakdown.waste.emissions },
      { name: "food", value: result.breakdown.food.emissions },
    ];
    
    return categories
      .filter(cat => cat.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  const getPersonalizedTips = () => {
    const topCategories = getTopEmissionCategories();
    if (topCategories.length === 0) return [];
    
    const tips = {
      transport: [
        "Use public transportation or carpooling to reduce individual emissions",
        "Consider walking or cycling for short distances",
        "If possible, invest in a more fuel-efficient vehicle or electric vehicle",
        "Combine errands to reduce the number of trips",
        "Maintain your vehicle properly to ensure optimal fuel efficiency",
      ],
      electricity: [
        "Switch to energy-efficient LED light bulbs",
        "Unplug electronics when not in use to avoid phantom power usage",
        "Use smart power strips to automatically cut power to devices",
        "Adjust your thermostat to use less heating or cooling when away",
        "Consider switching to renewable energy sources if available",
      ],
      waste: [
        "Implement a comprehensive recycling program at home",
        "Start composting food scraps and yard waste",
        "Reduce single-use plastics by using reusable alternatives",
        "Buy products with minimal packaging",
        "Donate or repurpose items instead of throwing them away",
      ],
      food: [
        "Consider reducing meat consumption, especially red meat",
        "Buy local and seasonal produce to reduce transportation emissions",
        "Plan meals to reduce food waste",
        "Grow your own herbs and vegetables if possible",
        "Choose products with sustainable packaging",
      ],
    };

    const selectedTips: string[] = [];
    const categoriesUsed = new Set<string>();
    
    topCategories.forEach((category, index) => {
      if (categoriesUsed.size >= 3) return;
      
      const categoryTips = tips[category.name as keyof typeof tips];
      if (!categoryTips) return;
      
      if (index === 0) {
        selectedTips.push(...categoryTips.slice(0, 2));
      } else {
        selectedTips.push(categoryTips[0]);
      }
      
      categoriesUsed.add(category.name);
    });

    return selectedTips;
  };

  const handleDownload = async () => {
    try {
      await downloadCalculationResults();
      toast({
        title: "Success",
        description: "Your results have been downloaded successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div id="results-container" className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-eco-neutral-700">Your Carbon Footprint Results</h1>
          <p className="text-xl text-eco-neutral-500 mt-2">
            Based on your inputs, here's how your lifestyle impacts the environment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="eco-card col-span-3 md:col-span-1">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-eco-neutral-700 mb-2">Total Emissions</h2>
              <div className="text-4xl font-bold text-primary mb-2">
                {result.total} kg CO₂e
              </div>
              <p className="text-sm text-eco-neutral-500">
                per month, based on your lifestyle
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Breakdown</h3>
                <ul className="space-y-2">
                  {barData.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="text-eco-neutral-700">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-eco-neutral-700 font-medium mr-2">
                          {item.emissions} kg
                        </span>
                        <span className="text-xs text-eco-neutral-500">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card col-span-3 md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-eco-neutral-700 mb-4">Emissions by Category</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} kg CO₂e`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit=" kg" />
                    <Tooltip
                      formatter={(value) => [`${value} kg CO₂e`, "Emissions"]}
                    />
                    <Legend />
                    <Bar dataKey="emissions" name="Emissions (kg CO₂e)" fill="#22C55E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {isAuthenticated && (
          <Card className="eco-card mb-10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-eco-green-100 p-3 rounded-full">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-eco-neutral-700 mb-2">
                    Personalized Tips to Reduce Your Footprint
                  </h2>
                  <p className="text-eco-neutral-500 mb-4">
                    Based on your highest emission categories, here are some ways you can reduce your carbon footprint:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    {getPersonalizedTips().map((tip, index) => (
                      <li key={index} className="text-eco-neutral-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isAuthenticated && (
          <Card className="eco-card mb-10 bg-eco-blue-100/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-12 w-12 text-eco-blue-500" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-xl font-bold text-eco-neutral-700 mb-2">
                    Sign Up for Personalized Tips
                  </h2>
                  <p className="text-eco-neutral-500 mb-4">
                    Create an account to receive customized recommendations for reducing your carbon footprint
                    based on your specific lifestyle.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button className="eco-gradient" asChild>
                    <Link to="/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" asChild>
            <Link to="/calculator">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Calculator
            </Link>
          </Button>
          <div className="flex gap-2">
            <ShareCard 
              username={isAuthenticated ? "User" : "Guest"} 
              totalEmissions={result.total} 
            />
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
