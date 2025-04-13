
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WasteData } from "@/pages/Calculator";
import { PlusCircle, Trash2 } from "lucide-react";

interface WasteFormProps {
  data: WasteData[];
  updateData: (data: WasteData[]) => void;
}

const WasteForm = ({ data, updateData }: WasteFormProps) => {
  const handleChange = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      garbageBags: value,
    };
    updateData(newData);
  };

  const addWasteEntry = () => {
    updateData([...data, { garbageBags: "" }]);
  };

  const removeWasteEntry = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    updateData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-eco-neutral-700">Waste Generation</h3>
        <p className="text-sm text-eco-neutral-500">
          Tell us about your weekly waste production
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
              onClick={() => removeWasteEntry(index)}
            >
              <Trash2 className="h-4 w-4 text-eco-neutral-500" />
            </Button>
          )}

          <div className="space-y-2">
            <Label htmlFor={`garbageBags-${index}`}>Garbage Bags Per Week</Label>
            <Input
              id={`garbageBags-${index}`}
              type="number"
              min="0"
              step="0.5"
              placeholder="Enter number of bags"
              value={entry.garbageBags}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            <p className="text-xs text-eco-neutral-500 mt-1">
              Standard size garbage bags (13 gallon/50 liter)
            </p>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addWasteEntry}
        className="w-full mt-4"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Waste Entry
      </Button>
    </div>
  );
};

export default WasteForm;
