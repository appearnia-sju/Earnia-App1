import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { NGO } from "../types";
import { motion } from "motion/react";

interface NGOCardProps {
  ngo: NGO;
}

const NGOCard: React.FC<NGOCardProps> = ({ ngo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={ngo.coverImage}
          alt={ngo.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4">
          {ngo.verified && (
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 border border-green-500/30">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 relative">
        <div className="absolute -top-10 left-6 w-16 h-16 rounded-xl border-4 border-white dark:border-zinc-900 overflow-hidden bg-white shadow-md">
          <img
            src={ngo.logo}
            alt={`${ngo.name} logo`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-orange-600 transition-colors">
            {ngo.name}
          </h3>
          <div className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            <MapPin size={14} />
            <span>{ngo.city}, {ngo.state}</span>
          </div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed">
            {ngo.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {ngo.category.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-semibold rounded-md uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>

          <Link
            to={`/ngo/${ngo.id}`}
            className="mt-6 w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold hover:bg-orange-600 hover:text-white transition-all duration-300"
          >
            <span>View Profile</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NGOCard;
