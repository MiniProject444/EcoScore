
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cookies = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-eco-neutral-700 mb-8 text-center">
        Cookie Policy
      </h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              What Are Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you 
              browse websites. They are widely used to make websites work more efficiently and provide 
              a better user experience.
            </p>
            <p>
              EcoScore uses cookies to enhance your experience on our platform, remember your preferences, 
              and provide personalized content and features.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Types of Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-eco-neutral-700 mb-2">Essential Cookies</h4>
                <p>
                  These cookies are necessary for the website to function properly. They enable core 
                  functionality such as security, network management, and accessibility.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-eco-neutral-700 mb-2">Performance Cookies</h4>
                <p>
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our website's performance.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-eco-neutral-700 mb-2">Functional Cookies</h4>
                <p>
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your login details and preferred settings.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-eco-neutral-700 mb-2">Authentication Cookies</h4>
                <p>
                  These cookies are used to identify you when you log in to your account and keep you 
                  logged in during your session.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              How We Use Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To keep you logged in to your EcoScore account</li>
              <li>To remember your carbon footprint calculation preferences</li>
              <li>To provide personalized recommendations based on your usage patterns</li>
              <li>To analyze website traffic and optimize our service performance</li>
              <li>To remember your language and display preferences</li>
              <li>To ensure the security of your account and prevent fraud</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Third-Party Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              We may use third-party services that also set cookies on your device. These may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication services (Supabase) for secure login functionality</li>
              <li>Analytics services to understand website usage patterns</li>
              <li>Content delivery networks to improve website performance</li>
            </ul>
            <p>
              These third parties have their own privacy policies and cookie policies, which we encourage you to review.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Managing Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              You can control and manage cookies in various ways. Please note that removing or blocking 
              cookies may impact your user experience and some functionality may not work as intended.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-eco-neutral-700 mb-2">Browser Settings</h4>
                <p>
                  Most browsers allow you to view, manage, and delete cookies. You can usually find 
                  these options in your browser's settings or preferences menu.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-eco-neutral-700 mb-2">Browser-Specific Instructions</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
                  <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                  <li>Safari: Preferences → Privacy → Manage Website Data</li>
                  <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Cookie Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              By continuing to use EcoScore, you consent to our use of cookies as described in this policy. 
              If you do not agree to our use of cookies, you should disable them through your browser 
              settings or discontinue use of our website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-eco-neutral-700">
              Updates to This Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-eco-neutral-600">
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We encourage you to review this policy periodically.
            </p>
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
              If you have questions about our use of cookies, please contact us at 
              <a href="mailto:cookies@ecoscore.com" className="text-primary hover:underline ml-1">
                cookies@ecoscore.com
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

export default Cookies;
