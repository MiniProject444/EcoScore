
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-eco-neutral-700 mb-8 text-center">
        Terms of Service
      </h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              By accessing and using EcoScore, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Use License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              Permission is granted to temporarily use EcoScore for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              User Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password 
              and for all activities that occur under your account.
            </p>
            <p>
              You agree not to disclose your password to any third party and to take sole 
              responsibility for any activities or actions under your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Carbon Footprint Calculations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              Our carbon footprint calculations are estimates based on commonly accepted methodologies 
              and emission factors. While we strive for accuracy, the results should be considered 
              approximations and used for educational and awareness purposes.
            </p>
            <p>
              EcoScore is not responsible for decisions made based on these calculations. 
              For precise measurements required for official reporting, please consult certified professionals.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Prohibited Uses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>You may not use our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations or laws</li>
              <li>To transmit or procure the sending of any advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate another person or entity</li>
              <li>To interfere with or circumvent security features of the service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              The materials on EcoScore are provided on an 'as is' basis. EcoScore makes no warranties, 
              expressed or implied, and hereby disclaim and negate all other warranties including without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular 
              purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              In no event shall EcoScore or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising 
              out of the use or inability to use the materials on EcoScore, even if EcoScore or a 
              EcoScore authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-eco-neutral-600">
            <p>
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@ecoscore.com" className="text-primary hover:underline ml-1">
                legal@ecoscore.com
              </a>
            </p>
            <p className="mt-4 text-sm text-eco-neutral-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link 
          to="/" 
          className="text-primary hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Terms;
