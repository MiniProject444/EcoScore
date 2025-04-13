
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransportationData } from "@/pages/Calculator";
import { PlusCircle, Trash2 } from "lucide-react";

interface TransportationFormProps {
  data: TransportationData[];
  updateData: (data: TransportationData[]) => void;
}

const TransportationForm = ({ data, updateData }: TransportationFormProps) => {
  const handleChange = (index: number, field: keyof TransportationData, value: string) => {
    const newData = [...data];
    
    // Handle special case for transportType which affects available options
    if (field === "transportType") {
      // Ensure the value is a valid transport type
      const transportType = value as "car" | "bus" | "train" | "plane";
      
      newData[index] = {
        ...newData[index],
        [field]: transportType,
        // Reset dependent fields based on transport type
        vehicleType: transportType === "car" ? "medium" : undefined,
        travelClass: transportType === "plane" ? "economy" : undefined,
      };
    } else {
      newData[index] = {
        ...newData[index],
        [field]: value,
      };
    }
    
    updateData(newData);
  };

  const addTransportEntry = () => {
    updateData([
      ...data,
      {
        transportType: "car",
        vehicleType: "medium",
        distance: "",
        distanceUnit: "km",
      },
    ]);
  };

  const removeTransportEntry = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    updateData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-eco-neutral-700">Transportation</h3>
        <p className="text-sm text-eco-neutral-500">
          Tell us about your daily transportation usage
        </p>
      </div>

      {data.map((entry, index) => (
        <div 
          key={index} 
          className="p-4 border border-eco-neutral-100 rounded-lg space-y-4 relative"
        >
          {data.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeTransportEntry(index)}
            >
              <Trash2 className="h-4 w-4 text-eco-neutral-500" />
            </Button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`transportType-${index}`}>Transport Type</Label>
              <Select
                value={entry.transportType}
                onValueChange={(value) => handleChange(index, "transportType", value)}
              >
                <SelectTrigger id={`transportType-${index}`}>
                  <SelectValue placeholder="Select transport type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="plane">Plane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {entry.transportType === "car" && (
              <div className="space-y-2">
                <Label htmlFor={`vehicleType-${index}`}>Vehicle Type</Label>
                <Select
                  value={entry.vehicleType}
                  onValueChange={(value) => handleChange(index, "vehicleType", value)}
                >
                  <SelectTrigger id={`vehicleType-${index}`}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (Compact/Sedan)</SelectItem>
                    <SelectItem value="medium">Medium (SUV)</SelectItem>
                    <SelectItem value="large">Large (MUV/Truck)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {entry.transportType === "plane" && (
              <div className="space-y-2">
                <Label htmlFor={`travelClass-${index}`}>Travel Class</Label>
                <Select
                  value={entry.travelClass}
                  onValueChange={(value) => handleChange(index, "travelClass", value)}
                >
                  <SelectTrigger id={`travelClass-${index}`}>
                    <SelectValue placeholder="Select travel class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`distance-${index}`}>Distance</Label>
              <Input
                id={`distance-${index}`}
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter distance"
                value={entry.distance}
                onChange={(e) => handleChange(index, "distance", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`distanceUnit-${index}`}>Distance Unit</Label>
              <Select
                value={entry.distanceUnit}
                onValueChange={(value) => handleChange(index, "distanceUnit", value)}
              >
                <SelectTrigger id={`distanceUnit-${index}`}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addTransportEntry}
        className="w-full mt-4"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Transportation Method
      </Button>
    </div>
  );
};

export default TransportationForm;
