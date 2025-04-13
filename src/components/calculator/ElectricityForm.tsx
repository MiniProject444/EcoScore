
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ElectricityData } from "@/pages/Calculator";
import { PlusCircle, Trash2 } from "lucide-react";

interface ElectricityFormProps {
  data: ElectricityData[];
  updateData: (data: ElectricityData[]) => void;
}

const ElectricityForm = ({ data, updateData }: ElectricityFormProps) => {
  const handleChange = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      consumption: value,
    };
    updateData(newData);
  };

  const addElectricityEntry = () => {
    updateData([...data, { consumption: "" }]);
  };

  const removeElectricityEntry = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    updateData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-eco-neutral-700">Electricity Usage</h3>
        <p className="text-sm text-eco-neutral-500">
          Tell us about your monthly electricity consumption
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
              onClick={() => removeElectricityEntry(index)}
            >
              <Trash2 className="h-4 w-4 text-eco-neutral-500" />
            </Button>
          )}

          <div className="space-y-2">
            <Label htmlFor={`consumption-${index}`}>Monthly Electricity Consumption (kWh)</Label>
            <Input
              id={`consumption-${index}`}
              type="number"
              min="0"
              placeholder="Enter consumption in kWh"
              value={entry.consumption}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            <p className="text-xs text-eco-neutral-500 mt-1">
              You can find this information on your electricity bill
            </p>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addElectricityEntry}
        className="w-full mt-4"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Electricity Entry
      </Button>
    </div>
  );
};

export default ElectricityForm;
