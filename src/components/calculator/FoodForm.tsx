
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
import { FoodData } from "@/pages/Calculator";
import { PlusCircle, Trash2 } from "lucide-react";

interface FoodFormProps {
  data: FoodData[];
  updateData: (data: FoodData[]) => void;
}

const FoodForm = ({ data, updateData }: FoodFormProps) => {
  const handleChange = (index: number, field: keyof FoodData, value: string) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    updateData(newData);
  };

  const addFoodEntry = () => {
    updateData([...data, { moneySpent: "", eateryType: "homeCooked" }]);
  };

  const removeFoodEntry = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    updateData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-eco-neutral-700">Food Consumption</h3>
        <p className="text-sm text-eco-neutral-500">
          Tell us about your monthly food spending and eating habits
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
              onClick={() => removeFoodEntry(index)}
            >
              <Trash2 className="h-4 w-4 text-eco-neutral-500" />
            </Button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`moneySpent-${index}`}>Monthly Food Spending ($)</Label>
              <Input
                id={`moneySpent-${index}`}
                type="number"
                min="0"
                placeholder="Enter amount in dollars"
                value={entry.moneySpent}
                onChange={(e) => handleChange(index, "moneySpent", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`eateryType-${index}`}>Eating Habits</Label>
              <Select
                value={entry.eateryType}
                onValueChange={(value) => handleChange(index, "eateryType", value)}
              >
                <SelectTrigger id={`eateryType-${index}`}>
                  <SelectValue placeholder="Select eating habit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homeCooked">Home Cooked</SelectItem>
                  <SelectItem value="fastFood">Fast Food</SelectItem>
                  <SelectItem value="restaurant">Fine Dining/Restaurant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addFoodEntry}
        className="w-full mt-4"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Food Entry
      </Button>
    </div>
  );
};

export default FoodForm;
