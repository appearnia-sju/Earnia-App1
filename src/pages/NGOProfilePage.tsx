import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  CheckCircle, 
  Calendar, 
  ArrowLeft,
  Share2,
  ExternalLink
} from "lucide-react";
import { useAppContext } from "../store/AppContext";
import { motion, AnimatePresence } from "motion/react";

const NGOProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { ngos, posts, refreshData } = useAppContext();
  
  const ngo = ngos.find(n => n.id === id);
  const ngoPosts = posts.filter(p => p.ngoId === id);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    import("../utils/storage").then(m => {
      m.addPost({
        ngoId: id!,
        title: newPost.title,
        content: newPost.content,
        images: ["https://picsum.photos/seed/newpost/800/600"]
      });
      refreshData();
      setShowPostModal(false);
      setNewPost({ title: "", content: "" });
    });
  };

  if (!ngo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">NGO not found</h2>
        <Link to="/" className="text-orange-600 mt-4 inline-block font-bold">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img 
          src={ngo.coverImage} 
          alt={ngo.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white dark:border-zinc-900 overflow-hidden bg-white shadow-xl flex-shrink-0">
              <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{ngo.name}</h1>
                {ngo.verified && <CheckCircle className="text-green-400" size={28} />}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/90 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>{ngo.city}, {ngo.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={18} />
                  <span>Joined {new Date(ngo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all">
                <Share2 size={20} />
              </button>
              <a 
                href={ngo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30"
              >
                <span>Visit Website</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">About the Organization</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {ngo.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Focus Areas</h2>
              <div className="flex flex-wrap gap-3">
                {ngo.category.map((cat, i) => (
                  <span key={i} className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl font-bold border border-orange-200 dark:border-orange-800/30">
                    {cat}
                  </span>
                ))}
                {ngo.causes.map((cause, i) => (
                  <span key={i} className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold border border-green-200 dark:border-green-800/30">
                    {cause}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Recent Updates</h2>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 font-medium">{ngoPosts.length} posts</span>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold text-sm hover:bg-orange-600 hover:text-white transition-all"
                  >
                    + Create Post
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {ngoPosts.length > 0 ? (
                  ngoPosts.map(post => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm"
                    >
                      {post.images.length > 0 && (
                        <div className="h-64 w-full overflow-hidden">
                          <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{post.title}</h3>
                          <span className="text-sm text-zinc-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-zinc-100 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                    <p className="text-zinc-500">No updates posted yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-zinc-600 dark:text-zinc-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</p>
                    <a href={`mailto:${ngo.email}`} className="text-zinc-900 dark:text-white font-medium hover:text-orange-600">{ngo.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-zinc-600 dark:text-zinc-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Phone</p>
                    <a href={`tel:${ngo.phone}`} className="text-zinc-900 dark:text-white font-medium hover:text-orange-600">{ngo.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Globe className="text-zinc-600 dark:text-zinc-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Website</p>
                    <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-white font-medium hover:text-orange-600">{ngo.website}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-600/20">
              <h3 className="text-xl font-bold mb-4">Support this NGO</h3>
              <p className="text-orange-100 mb-6">Your contribution can help them achieve their mission and reach more people in need.</p>
              <button className="w-full py-4 bg-white text-orange-600 font-black rounded-2xl hover:bg-orange-50 transition-all uppercase tracking-wider text-sm">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">Create New Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Post Title</label>
                  <input
                    required
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="What's happening?"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-2xl hover:bg-zinc-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                  >
                    Post Update
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

export default NGOProfilePage;
