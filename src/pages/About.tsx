
import { Leaf, Globe, Heart, Award, Users } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-eco-neutral-700 mb-4">About EcoScore</h1>
          <p className="text-xl text-eco-neutral-500">
            Helping you understand and reduce your carbon footprint
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-eco-neutral-700 mb-12">
          <p>
            EcoScore is a web application dedicated to helping individuals understand their impact on the environment through carbon footprint calculation. Our mission is to empower people with knowledge and tools to make more sustainable choices in their daily lives.
          </p>
          
          <p>
            Climate change is one of the most pressing challenges of our time, and understanding our personal contribution is the first step toward meaningful action. EcoScore provides a user-friendly interface to calculate your carbon footprint across multiple categories, visualize your impact, and receive personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="eco-card p-6">
            <div className="bg-eco-green-100 p-3 rounded-full w-fit mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-eco-neutral-700 mb-2">Our Mission</h2>
            <p className="text-eco-neutral-500">
              To make carbon footprint calculation accessible to everyone and encourage sustainable lifestyle choices through personalized insights and recommendations.
            </p>
          </div>

          <div className="eco-card p-6">
            <div className="bg-eco-blue-100 p-3 rounded-full w-fit mb-4">
              <Globe className="h-6 w-6 text-eco-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-eco-neutral-700 mb-2">Our Vision</h2>
            <p className="text-eco-neutral-500">
              A world where individuals are empowered with the knowledge and tools to make environmentally conscious decisions, leading to a significant reduction in global carbon emissions.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-eco-neutral-700 mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="eco-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-eco-green-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-eco-neutral-700 mb-2">Accuracy</h3>
            <p className="text-eco-neutral-500">
              We're committed to providing the most accurate carbon footprint calculations based on established scientific methodologies.
            </p>
          </div>

          <div className="eco-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-eco-green-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-eco-neutral-700 mb-2">Accessibility</h3>
            <p className="text-eco-neutral-500">
              We believe that environmental tools should be accessible to everyone, regardless of technical expertise.
            </p>
          </div>

          <div className="eco-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-eco-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-eco-neutral-700 mb-2">Community</h3>
            <p className="text-eco-neutral-500">
              We foster a community of environmentally conscious individuals working together toward a more sustainable future.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-eco-neutral-700 mb-6">How We Calculate Your Carbon Footprint</h2>
        <div className="prose prose-lg max-w-none text-eco-neutral-700 mb-12">
          <p>
            Our carbon footprint calculator uses a comprehensive methodology based on emissions factors for different activities:
          </p>
          
          <ul>
            <li>
              <strong>Transportation:</strong> We factor in the type of vehicle, distance traveled, and fuel efficiency to calculate emissions from cars, buses, trains, and planes.
            </li>
            <li>
              <strong>Electricity:</strong> We convert your electricity consumption into carbon emissions based on the average carbon intensity of electricity generation.
            </li>
            <li>
              <strong>Waste:</strong> We estimate the emissions from waste generation based on the number of garbage bags you produce weekly.
            </li>
            <li>
              <strong>Food:</strong> We calculate the carbon footprint of your food consumption based on your spending patterns and eating habits.
            </li>
          </ul>
          
          <p>
            All calculations are based on peer-reviewed scientific research and regularly updated emission factors. Our goal is to provide you with the most accurate estimate of your carbon footprint.
          </p>
        </div>

        <div className="eco-card p-6 mb-12">
          <h2 className="text-2xl font-bold text-eco-neutral-700 mb-4">Contact Us</h2>
          <p className="text-eco-neutral-500 mb-4">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          <ul className="space-y-2 text-eco-neutral-700">
            <li>Email: contact@ecoscore.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Address: 123 Green Street, Eco City, Planet Earth</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
