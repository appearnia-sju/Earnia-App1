import React, { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../store/AppContext";
import NGOCard from "../components/NGOCard";
import { motion, AnimatePresence } from "motion/react";

const DirectoryPage: React.FC = () => {
  const { ngos } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    ngos.forEach(n => n.category.forEach(c => cats.add(c)));
    return ["All", ...Array.from(cats)];
  }, [ngos]);

  const states = useMemo(() => {
    const sts = new Set<string>();
    ngos.forEach(n => sts.add(n.state));
    return ["All", ...Array.from(sts)];
  }, [ngos]);

  const filteredNGOs = useMemo(() => {
    return ngos.filter(ngo => {
      if (ngo.status !== "approved") return false;
      
      const matchesSearch = 
        ngo.name.toLowerCase().includes(search.toLowerCase()) ||
        ngo.city.toLowerCase().includes(search.toLowerCase()) ||
        ngo.causes.some(c => c.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || ngo.category.includes(selectedCategory);
      const matchesState = selectedState === "All" || ngo.state === selectedState;
      const matchesVerified = !verifiedOnly || ngo.verified;

      return matchesSearch && matchesCategory && matchesState && matchesVerified;
    });
  }, [ngos, search, selectedCategory, selectedState, verifiedOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-6"
        >
          Find NGOs Making an <span className="text-orange-600">Impact</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
        >
          Discover and connect with verified non-profit organizations working towards a better future.
        </motion.p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-12 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name, city, or cause..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl border transition-all ${
              showFilters 
                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-600"
            }`}
          >
            <SlidersHorizontal size={20} />
            <span className="font-bold">Filters</span>
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                >
                  {states.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all ${
                    verifiedOnly 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-600 text-green-600" 
                      : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span className="font-bold">Verified Only</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Grid */}
      {filteredNGOs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNGOs.map(ngo => (
            <NGOCard key={ngo.id} ngo={ngo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-zinc-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No NGOs found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedState("All"); setVerifiedOnly(false); }}
            className="mt-6 text-orange-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
