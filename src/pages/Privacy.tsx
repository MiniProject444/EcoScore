
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-eco-neutral-700 mb-8 text-center">
        Privacy Policy
      </h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              use our carbon footprint calculator, or contact us for support.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address)</li>
              <li>Carbon footprint calculation data (transportation, energy usage, etc.)</li>
              <li>Usage data and preferences</li>
              <li>Communications with our support team</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our carbon footprint calculation services</li>
              <li>Generate personalized environmental impact reports</li>
              <li>Improve our services and develop new features</li>
              <li>Send you updates and educational content about sustainability</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Information Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties. 
              We may share aggregated, anonymized data for research purposes to advance sustainability efforts.
            </p>
            <p>
              We may disclose your information if required by law or to protect our rights and safety.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. We use industry-standard 
              encryption and security protocols.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-eco-neutral-600">
            <p>
              If you have questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@ecoscore.com" className="text-primary hover:underline ml-1">
                privacy@ecoscore.com
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

export default Privacy;
