import React, { useState } from "react";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Download, 
  Trash2, 
  Edit, 
  AlertTriangle,
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import { useAppContext } from "../store/AppContext";
import { updateNGO, deleteNGO, exportNGOsToCSV } from "../utils/storage";
import { NGO } from "../types";
import { motion, AnimatePresence } from "motion/react";

const AdminDashboardPage: React.FC = () => {
  const { ngos, refreshData, isAdmin } = useAppContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [editingNGO, setEditingNGO] = useState<NGO | null>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Unauthorized Access</h2>
        <p className="text-zinc-500 mt-2">Please login as admin to view this page.</p>
      </div>
    );
  }

  const stats = {
    total: ngos.length,
    pending: ngos.filter(n => n.status === "pending").length,
    approved: ngos.filter(n => n.status === "approved").length,
  };

  const filteredNGOs = ngos.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(search.toLowerCase()) || n.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || n.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: string) => {
    updateNGO(id, { status: "approved", verified: true });
    refreshData();
  };

  const handleReject = (id: string) => {
    updateNGO(id, { status: "rejected", verified: false });
    refreshData();
  };

  const handleUpdateNGO = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNGO) {
      updateNGO(editingNGO.id, editingNGO);
      refreshData();
      setEditingNGO(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this NGO?")) {
      deleteNGO(id);
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage NGO registrations and verifications</p>
        </div>
        <button
          onClick={exportNGOsToCSV}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
            <Users className="text-blue-600" size={24} />
          </div>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Total NGOs</p>
          <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-1">{stats.total}</h3>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
            <Clock className="text-orange-600" size={24} />
          </div>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Pending Approval</p>
          <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-1">{stats.pending}</h3>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Approved NGOs</p>
          <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-1">{stats.approved}</h3>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search NGOs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter size={18} className="text-zinc-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="flex-grow md:flex-grow-0 p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">NGO Details</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <AnimatePresence>
                {filteredNGOs.map((ngo) => (
                  <motion.tr 
                    key={ngo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={ngo.logo} alt="" className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-zinc-900 dark:text-white">{ngo.name}</h4>
                            {ngo.isDuplicate && (
                              <div className="group relative">
                                <AlertTriangle size={16} className="text-amber-500" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-amber-500 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Potential Duplicate
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-zinc-500">{ngo.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">{ngo.city}</p>
                      <p className="text-xs text-zinc-500">{ngo.state}</p>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        ngo.status === "approved" ? "bg-green-100 text-green-600 dark:bg-green-900/30" :
                        ngo.status === "pending" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30" :
                        "bg-red-100 text-red-600 dark:bg-red-900/30"
                      }`}>
                        {ngo.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2">
                        {ngo.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(ngo.id)}
                              className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(ngo.id)}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                              title="Reject"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setEditingNGO(ngo)}
                          className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ngo.id)}
                          className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <a
                          href={`/ngo/${ngo.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                          title="View Profile"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingNGO && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">Edit NGO Details</h3>
              <form onSubmit={handleUpdateNGO} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Name</label>
                    <input
                      required
                      type="text"
                      value={editingNGO.name}
                      onChange={(e) => setEditingNGO({ ...editingNGO, name: e.target.value })}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={editingNGO.email}
                      onChange={(e) => setEditingNGO({ ...editingNGO, email: e.target.value })}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">City</label>
                    <input
                      required
                      type="text"
                      value={editingNGO.city}
                      onChange={(e) => setEditingNGO({ ...editingNGO, city: e.target.value })}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">State</label>
                    <input
                      required
                      type="text"
                      value={editingNGO.state}
                      onChange={(e) => setEditingNGO({ ...editingNGO, state: e.target.value })}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingNGO.description}
                    onChange={(e) => setEditingNGO({ ...editingNGO, description: e.target.value })}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingNGO(null)}
                    className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-zinc-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardPage;
