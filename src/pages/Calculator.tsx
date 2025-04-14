
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/services/api";
import TransportationForm from "@/components/calculator/TransportationForm";
import ElectricityForm from "@/components/calculator/ElectricityForm";
import WasteForm from "@/components/calculator/WasteForm";
import FoodForm from "@/components/calculator/FoodForm";
import { Car, Plug, Trash2, Utensils, ArrowRight, BarChart, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export interface TransportationData {
  transportType: "car" | "bus" | "train" | "plane";
  vehicleType?: "small" | "medium" | "large";
  travelClass?: "economy" | "business" | "first";
  distance: string;
  distanceUnit: "km" | "miles";
}

export interface ElectricityData {
  consumption: string;
}

export interface WasteData {
  garbageBags: string;
}

export interface FoodData {
  moneySpent: string;
  eateryType: "homeCooked" | "fastFood" | "restaurant";
}

export interface CalculatorData {
  transportData: TransportationData[];
  electricityData: ElectricityData[];
  wasteData: WasteData[];
  foodData: FoodData[];
}

const Calculator = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("transportation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    transportData: [
      {
        transportType: "car",
        vehicleType: "medium",
        distance: "",
        distanceUnit: "km",
      },
    ],
    electricityData: [{ consumption: "" }],
    wasteData: [{ garbageBags: "" }],
    foodData: [{ moneySpent: "", eateryType: "homeCooked" }],
  });

  const updateTransportData = (data: TransportationData[]) => {
    setCalculatorData((prev) => ({ ...prev, transportData: data }));
  };

  const updateElectricityData = (data: ElectricityData[]) => {
    setCalculatorData((prev) => ({ ...prev, electricityData: data }));
  };

  const updateWasteData = (data: WasteData[]) => {
    setCalculatorData((prev) => ({ ...prev, wasteData: data }));
  };

  const updateFoodData = (data: FoodData[]) => {
    setCalculatorData((prev) => ({ ...prev, foodData: data }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNextTab = () => {
    switch (activeTab) {
      case "transportation":
        setActiveTab("electricity");
        break;
      case "electricity":
        setActiveTab("waste");
        break;
      case "waste":
        setActiveTab("food");
        break;
      case "food":
        handleSubmit();
        break;
    }
  };

  const hasValidInput = () => {
    const hasTransportInput = calculatorData.transportData.some(item => 
      item.distance && !isNaN(Number(item.distance)) && Number(item.distance) > 0
    );
    
    const hasElectricityInput = calculatorData.electricityData.some(item => 
      item.consumption && !isNaN(Number(item.consumption)) && Number(item.consumption) > 0
    );
    
    const hasWasteInput = calculatorData.wasteData.some(item => 
      item.garbageBags && !isNaN(Number(item.garbageBags)) && Number(item.garbageBags) > 0
    );
    
    const hasFoodInput = calculatorData.foodData.some(item => 
      item.moneySpent && !isNaN(Number(item.moneySpent)) && Number(item.moneySpent) > 0
    );
    
    console.log("Input validation:", { hasTransportInput, hasElectricityInput, hasWasteInput, hasFoodInput });
    return hasTransportInput || hasElectricityInput || hasWasteInput || hasFoodInput;
  };

  const handleSubmit = async () => {
    if (!hasValidInput()) {
      toast({
        variant: "destructive", // Changed from "warning" to "destructive"
        title: "No data provided",
        description: "Please provide input for at least one category before calculating",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Submitting calculator data:", calculatorData);
      
      const result = await api.calculator.calculate(calculatorData, isAuthenticated);
      
      console.log("Calculation result:", result);
      
      // Enhanced validation of the result object
      if (!result || typeof result !== 'object') {
        throw new Error("Could not calculate emissions. Please try again.");
      }
      
      // If result is in message format (error from API), throw error
      if ('message' in result) {
        throw new Error(result.message || "Could not calculate emissions. Please try again.");
      }
      
      // Make sure the result has the required structure
      if (!('total' in result) || !('breakdown' in result)) {
        throw new Error("Invalid result format. Please try again.");
      }
      
      const validResult = {
        total: typeof result.total === 'number' ? result.total : 0,
        breakdown: {
          transport: result.breakdown?.transport || { emissions: 0, percentage: 0 },
          electricity: result.breakdown?.electricity || { emissions: 0, percentage: 0 },
          waste: result.breakdown?.waste || { emissions: 0, percentage: 0 },
          food: result.breakdown?.food || { emissions: 0, percentage: 0 }
        }
      };
      
      console.log("Validated result:", validResult);
      
      if (validResult.total === 0 && hasValidInput()) {
        console.warn("Calculation returned zero emissions despite valid input");
        toast({
          variant: "default", // Changed from "warning" to "default"
          title: "Low Emissions Detected",
          description: "Your calculation resulted in very low or zero emissions. This might be accurate or there might be an issue with the calculation.",
        });
      }
      
      navigate('/results', { state: { result: validResult, calculatorData } });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        variant: "destructive",
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate carbon footprint",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-eco-neutral-700">Calculate Your Carbon Footprint</h1>
          <p className="text-eco-neutral-500 mt-2">
            Answer questions about your lifestyle to see your environmental impact
          </p>
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-eco-blue-100/50 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-4">
              <p className="text-eco-neutral-700">Sign up to receive personalized tips based on your results</p>
              <Button className="eco-gradient" asChild>
                <Link to="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>

        <Card className="eco-card">
          <CardContent className="pt-6">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transportation" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Transport</span>
                </TabsTrigger>
                <TabsTrigger value="electricity" className="flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  <span className="hidden sm:inline">Electricity</span>
                </TabsTrigger>
                <TabsTrigger value="waste" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Waste</span>
                </TabsTrigger>
                <TabsTrigger value="food" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span className="hidden sm:inline">Food</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="transportation">
                  <TransportationForm 
                    data={calculatorData.transportData} 
                    updateData={updateTransportData} 
                  />
                </TabsContent>
                <TabsContent value="electricity">
                  <ElectricityForm 
                    data={calculatorData.electricityData} 
                    updateData={updateElectricityData} 
                  />
                </TabsContent>
                <TabsContent value="waste">
                  <WasteForm 
                    data={calculatorData.wasteData} 
                    updateData={updateWasteData} 
                  />
                </TabsContent>
                <TabsContent value="food">
                  <FoodForm 
                    data={calculatorData.foodData} 
                    updateData={updateFoodData} 
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              switch (activeTab) {
                case "electricity":
                  setActiveTab("transportation");
                  break;
                case "waste":
                  setActiveTab("electricity");
                  break;
                case "food":
                  setActiveTab("waste");
                  break;
              }
            }}
            disabled={activeTab === "transportation" || isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleNextTab}
            disabled={isSubmitting}
            className="eco-gradient"
          >
            {activeTab === "food" ? (
              <>
                Calculate <BarChart className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
