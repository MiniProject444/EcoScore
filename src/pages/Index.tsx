
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Leaf, Lightbulb, Recycle, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  
  const startCalculation = () => {
    navigate('/calculator');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-eco-green-100 to-eco-blue-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center md:text-left"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-eco-neutral-700 mb-4">
                  Measure Your{" "}
                  <span className="text-primary">Carbon Footprint</span>
                </h1>
                <p className="text-xl text-eco-neutral-500 mb-8">
                  Understand your impact on the environment and discover how to reduce it.
                </p>
                {isAuthenticated ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button size="lg" onClick={startCalculation} className="eco-gradient">
                      Calculate Your Footprint
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/dashboard">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        View Your Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button size="lg" onClick={startCalculation} className="eco-gradient">
                      Calculate Your Footprint
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/signup">
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Sign Up for Personalized Tips
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-xl overflow-hidden shadow-xl"
              >
                <img
                  src="https://previews.123rf.com/images/rufous/rufous1310/rufous131000026/22553170-green-earth-sustainable-development-concept.jpg"
                  alt="Sustainable Earth"
                  className="w-full h-auto rounded-xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-eco-neutral-700 mb-4">How EcoScore Works</h2>
            <p className="text-lg text-eco-neutral-500 max-w-3xl mx-auto">
              Track your carbon footprint across multiple categories and receive personalized
              recommendations to reduce your environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="eco-card p-6"
            >
              <div className="bg-eco-green-100 p-3 rounded-full w-fit mb-4">
                <Leaf className="h-8 w-8 text-eco-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-eco-neutral-700 mb-2">Calculate</h3>
              <p className="text-eco-neutral-500">
                Answer a few questions about your lifestyle and transportation habits to calculate your carbon footprint.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="eco-card p-6"
            >
              <div className="bg-eco-blue-100 p-3 rounded-full w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-eco-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-eco-neutral-700 mb-2">Visualize</h3>
              <p className="text-eco-neutral-500">
                See detailed breakdowns of your carbon emissions by category and track changes over time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="eco-card p-6"
            >
              <div className="bg-eco-green-100 p-3 rounded-full w-fit mb-4">
                <Lightbulb className="h-8 w-8 text-eco-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-eco-neutral-700 mb-2">Improve</h3>
              <p className="text-eco-neutral-500">
                Get personalized recommendations on how to reduce your carbon footprint and live more sustainably.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eco-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-eco-neutral-700 mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-eco-neutral-500 max-w-3xl mx-auto mb-8">
            Join thousands of users who are taking steps to reduce their carbon footprint and create a more sustainable future.
          </p>
          <Button size="lg" onClick={startCalculation} className="eco-gradient">
            Calculate Your Carbon Footprint
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
