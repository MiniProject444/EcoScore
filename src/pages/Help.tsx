
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  Calculator, 
  LineChart, 
  User,
  CheckCircle
} from "lucide-react";

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-eco-neutral-700 mb-4">Help & FAQ</h1>
          <p className="text-xl text-eco-neutral-500">
            Find answers to commonly asked questions about EcoScore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="eco-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-eco-green-100 p-3 rounded-full">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-eco-neutral-700 mb-2">Calculate</h3>
            <p className="text-eco-neutral-500 mb-4">
              Learn how to use our carbon footprint calculator effectively
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="#calculator-help">View Guide</a>
            </Button>
          </div>

          <div className="eco-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-eco-green-100 p-3 rounded-full">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-eco-neutral-700 mb-2">Results</h3>
            <p className="text-eco-neutral-500 mb-4">
              Understand how to interpret your carbon footprint results
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="#results-help">View Guide</a>
            </Button>
          </div>

          <div className="eco-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-eco-green-100 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-eco-neutral-700 mb-2">Account</h3>
            <p className="text-eco-neutral-500 mb-4">
              Get help with account creation, login, and management
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="#account-help">View Guide</a>
            </Button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-eco-neutral-700 mb-6" id="calculator-help">
          Using the Calculator
        </h2>
        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              How do I use the carbon footprint calculator?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                Using our calculator is simple! Just follow these steps:
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Click on the "Calculate Your Footprint" button on the homepage</li>
                <li>Fill in the required information for each category (Transportation, Electricity, Waste, and Food)</li>
                <li>Click "Next" to navigate between categories</li>
                <li>After completing all sections, click "Calculate" to see your results</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              What information do I need to calculate my carbon footprint?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-2">
                To get the most accurate results, you'll need:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Transportation details (vehicle type, distances traveled)</li>
                <li>Monthly electricity consumption (from your utility bill)</li>
                <li>Weekly waste generation (number of garbage bags)</li>
                <li>Monthly food spending and eating habits</li>
              </ul>
              <p className="mt-4">
                Don't worry if you don't have exact figures - your best estimate will still provide valuable insights.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              Can I save my calculation inputs for future reference?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              Yes! If you create an account and log in before using the calculator, your calculation history will be automatically saved. You can view your past calculations and track changes over time on your dashboard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-bold text-eco-neutral-700 mb-6" id="results-help">
          Understanding Your Results
        </h2>
        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              How do I interpret my carbon footprint results?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                Your results page shows your total carbon footprint in kilograms of CO₂ equivalent (kg CO₂e) per month, as well as a breakdown by category:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>The pie chart shows the proportion of emissions from each category</li>
                <li>The bar chart shows the absolute emissions from each category</li>
                <li>The breakdown table shows detailed figures for each category</li>
              </ul>
              <p className="mt-4">
                For context, the average person produces around 500-1000 kg CO₂e per month, depending on their country and lifestyle.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              What are personalized tips and how do I access them?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                Personalized tips are recommendations tailored to your specific carbon footprint profile. They suggest concrete actions you can take to reduce your emissions, focusing on the categories where you have the highest impact.
              </p>
              <p className="mb-4">
                To access personalized tips:
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Create an account and log in</li>
                <li>Complete a carbon footprint calculation</li>
                <li>View your personalized tips on the results page</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              How accurate are the carbon footprint calculations?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                Our calculations are based on scientifically established emission factors and methodologies. However, they are estimates that depend on the accuracy of the information you provide and the generalized emission factors we use.
              </p>
              <p className="mb-4">
                While not precise to the gram, they provide a good indication of your carbon footprint and where your main impacts lie. The most important aspect is tracking changes over time as you take steps to reduce your footprint.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-bold text-eco-neutral-700 mb-6" id="account-help">
          Account Management
        </h2>
        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              How do I create an account?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                Creating an account is easy:
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Click on "Sign Up" in the navigation menu</li>
                <li>Enter your name, email address, and create a password</li>
                <li>Submit the form to create your account</li>
                <li>You'll be automatically logged in and can start using all features</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              What are the benefits of having an account?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                Having an account provides several benefits:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Save your calculation history and track changes over time</li>
                <li>Access to personalized tips based on your carbon footprint</li>
                <li>Access to your personal dashboard with visualizations and insights</li>
                <li>Ability to set reduction goals and track progress</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-lg font-medium text-eco-neutral-700">
              How is my data used and protected?
            </AccordionTrigger>
            <AccordionContent className="text-eco-neutral-500">
              <p className="mb-4">
                We take data privacy seriously:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your personal information is stored securely and never shared with third parties without your consent</li>
                <li>Your carbon footprint data is used only to provide you with personalized insights and recommendations</li>
                <li>Aggregated, anonymized data may be used for research purposes to improve our calculator and insights</li>
              </ul>
              <p className="mt-4">
                For more details, please review our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="eco-card p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-eco-green-100 p-4 rounded-full">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-xl font-bold text-eco-neutral-700 mb-2">
                Still Have Questions?
              </h2>
              <p className="text-eco-neutral-500">
                If you couldn't find an answer to your question, feel free to contact our support team.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button className="eco-gradient">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-eco-neutral-700 mb-6">
          Quick Tips for Reducing Your Carbon Footprint
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Use public transportation, carpool, or bike when possible
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Switch to energy-efficient LED bulbs throughout your home
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Reduce meat consumption, especially red meat
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Unplug electronics when not in use to avoid phantom power usage
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Practice proper recycling and composting
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Buy local and seasonal produce to reduce transportation emissions
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Reduce water usage, especially hot water
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-eco-neutral-700">
              Choose products with minimal packaging and reuse where possible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
