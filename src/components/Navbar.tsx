import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Menu, 
  X, 
  LogIn, 
  User, 
  HelpCircle, 
  Info,
  Leaf,
  Trophy
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/stores/authStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-eco-neutral-700">ECOSCORE</span>
        </Link>

        {isMobile ? (
          <>
            <button
              onClick={toggleMenu}
              className="lg:hidden text-eco-neutral-500 hover:text-eco-neutral-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {isMenuOpen && (
              <div className="fixed inset-0 top-14 bg-white z-40 animate-fade-in">
                <div className="flex flex-col p-4 space-y-4">
                  <Link
                    to="/leaderboard"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-eco-neutral-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Trophy className="h-5 w-5 text-eco-neutral-500" />
                    <span>Leaderboard</span>
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-eco-neutral-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HelpCircle className="h-5 w-5 text-eco-neutral-500" />
                    <span>Help</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-eco-neutral-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info className="h-5 w-5 text-eco-neutral-500" />
                    <span>About</span>
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-eco-neutral-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5 text-eco-neutral-500" />
                        <span>Dashboard</span>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogIn className="h-5 w-5 mr-2 rotate-180" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full justify-start">
                          <LogIn className="h-5 w-5 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full justify-start">
                          <User className="h-5 w-5 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="hidden lg:flex items-center space-x-8">
            <div className="space-x-6">
              <Link
                to="/leaderboard"
                className="text-eco-neutral-500 hover:text-eco-neutral-700 transition-colors"
              >
                <Button variant="ghost" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>
              </Link>
              <Link
                to="/help"
                className="text-eco-neutral-500 hover:text-eco-neutral-700 transition-colors"
              >
                Help
              </Link>
              <Link
                to="/about"
                className="text-eco-neutral-500 hover:text-eco-neutral-700 transition-colors"
              >
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogIn className="h-4 w-4 mr-2 rotate-180" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
