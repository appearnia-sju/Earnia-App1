import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { useAppContext } from "../store/AppContext";
import { motion, AnimatePresence } from "motion/react";

const Header: React.FC = () => {
  const { theme, toggleTheme, isAdmin, setAdmin } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdmin(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              EARNIA <span className="text-orange-600">NGO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors">Directory</Link>
            <Link to="/register" className="text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors">Register NGO</Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="flex items-center space-x-1 text-green-600 dark:text-green-500 font-medium">
                <ShieldCheck size={18} />
                <span>Admin</span>
              </Link>
            )}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              {isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="px-4 py-2 rounded-full bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-zinc-600 dark:text-zinc-400">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zinc-600 dark:text-zinc-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-zinc-900 dark:text-white">Directory</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-zinc-900 dark:text-white">Register NGO</Link>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-green-600">Admin Dashboard</Link>
              )}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                {isAdmin ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl bg-orange-600 text-white font-medium"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">EARNIA NGO</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Empowering non-profits to reach more people and create lasting impact in communities across the globe.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
            <li><Link to="/" className="hover:text-orange-600">Directory</Link></li>
            <li><Link to="/register" className="hover:text-orange-600">Register NGO</Link></li>
            <li><Link to="/admin/login" className="hover:text-orange-600">Admin Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
            <li>support@earnia.com</li>
            <li>+1 (555) 000-0000</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center text-zinc-400 text-sm">
        &copy; {new Date().getFullYear()} EARNIA NGO Directory. All rights reserved.
      </div>
    </div>
  </footer>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
