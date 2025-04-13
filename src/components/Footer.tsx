
import { Link } from "react-router-dom";
import { Leaf, Mail, Github, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-eco-neutral-100 text-eco-neutral-700 py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">ECOSCORE</span>
            </Link>
            <p className="text-sm text-eco-neutral-500 mt-2">
              Calculate your carbon footprint and take steps towards a sustainable future.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  Calculator
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-eco-neutral-500 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" aria-label="Twitter" className="text-eco-neutral-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-eco-neutral-500 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-eco-neutral-500 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Github" className="text-eco-neutral-500 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-center space-x-2 text-eco-neutral-500">
              <Mail className="h-4 w-4" />
              <span className="text-sm">contact@ecoscore.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-eco-neutral-200 mt-8 pt-6 text-center text-sm text-eco-neutral-500">
          <p>© {currentYear} EcoScore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
