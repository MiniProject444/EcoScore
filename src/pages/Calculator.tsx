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
      item.distance && item.distance !== "0" && item.distance !== ""
    );
    
    const hasElectricityInput = calculatorData.electricityData.some(item => 
      item.consumption && item.consumption !== "0" && item.consumption !== ""
    );
    
    const hasWasteInput = calculatorData.wasteData.some(item => 
      item.garbageBags && item.garbageBags !== "0" && item.garbageBags !== ""
    );
    
    const hasFoodInput = calculatorData.foodData.some(item => 
      item.moneySpent && item.moneySpent !== "0" && item.moneySpent !== ""
    );
    
    return hasTransportInput || hasElectricityInput || hasWasteInput || hasFoodInput;
  };

  const handleSubmit = async () => {
    if (!hasValidInput()) {
      toast({
        variant: "destructive",
        title: "No data provided",
        description: "Please provide input for at least one category before calculating",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await api.calculator.calculate(calculatorData, isAuthenticated);
      
      navigate('/results', { state: { result, calculatorData } });
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
