import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Info, 
  MapPin, 
  FileText, 
  Mail, 
  Check,
  Image as ImageIcon,
  Camera,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { addNGO } from "../utils/storage";
import { useAppContext } from "../store/AppContext";

const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { refreshData } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    city: "",
    state: "",
    pan: "",
    registrationCert: "",
    email: "",
    phone: "",
    website: "",
    logo: "",
    coverImage: "",
  });
  const [fileNames, setFileNames] = useState({ logo: "", coverImage: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState({ logo: false, coverImage: false });

  const handleDragOver = (e: React.DragEvent, type: 'logo' | 'coverImage') => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, type: 'logo' | 'coverImage') => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'coverImage') => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [type]: false }));
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const fileName = files[0].name;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, [type]: event.target?.result as string }));
          setFileNames(prev => ({ ...prev, [type]: fileName }));
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const fileName = files[0].name;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, [name]: event.target?.result as string }));
          setFileNames(prev => ({ ...prev, [name]: fileName }));
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addNGO({
        ...formData,
        category: [formData.category],
        causes: ["General Welfare"], // Default cause for demo
      });
      refreshData();
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const steps = [
    { id: 1, title: "Basic Info", icon: <Info size={18} /> },
    { id: 2, title: "Location", icon: <MapPin size={18} /> },
    { id: 3, title: "Legal", icon: <FileText size={18} /> },
    { id: 4, title: "Contact", icon: <Mail size={18} /> },
    { id: 5, title: "Review", icon: <Check size={18} /> },
  ];

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-zinc-900 p-12 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">Registration Submitted!</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Your application is now under review. Our admin team will verify your details and notify you via email.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
          >
            Back to Directory
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">Register Your NGO</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Join our directory and reach more supporters across the country.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= s.id 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                    : "bg-white dark:bg-zinc-900 text-zinc-400 border-2 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {step > s.id ? <Check size={20} /> : s.icon}
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                step >= s.id ? "text-orange-600" : "text-zinc-400"
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Organization Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Helping Hands Foundation"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                  <textarea
                    required
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your mission and goals..."
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Primary Category</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Animal Welfare">Animal Welfare</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">NGO Logo</label>
                    <div className="flex flex-col items-start gap-4">
                      <div 
                        onClick={() => logoInputRef.current?.click()}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo')}
                        className={`group relative w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                          isDragging.logo
                            ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/10 scale-[1.02]'
                            : formData.logo 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:border-orange-600'
                        }`}
                      >
                        {formData.logo ? (
                          <>
                            <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="text-white" size={24} />
                            </div>
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                              <Check size={12} />
                            </div>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="text-zinc-400 mb-1" size={24} />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Preview</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                              formData.logo 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800 hover:bg-green-100' 
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-orange-600 hover:text-white'
                            }`}
                          >
                            {formData.logo ? <Check size={14} /> : <Upload size={14} />}
                            <span>{formData.logo ? 'Change Logo' : 'Select Logo'}</span>
                          </button>
                          {formData.logo && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, logo: "" }));
                                setFileNames(prev => ({ ...prev, logo: "" }));
                              }}
                              className="p-2 bg-zinc-100 dark:bg-zinc-800 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-zinc-200 dark:border-zinc-700"
                              title="Remove Logo"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        {fileNames.logo && (
                          <p className="text-[10px] text-zinc-500 truncate max-w-[150px] font-medium">
                            {fileNames.logo}
                          </p>
                        )}
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      name="logo" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Cover Image</label>
                    <div className="flex flex-col items-start gap-4">
                      <div 
                        onClick={() => coverInputRef.current?.click()}
                        onDragOver={(e) => handleDragOver(e, 'coverImage')}
                        onDragLeave={(e) => handleDragLeave(e, 'coverImage')}
                        onDrop={(e) => handleDrop(e, 'coverImage')}
                        className={`group relative w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                          isDragging.coverImage
                            ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/10 scale-[1.01]'
                            : formData.coverImage 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:border-orange-600'
                        }`}
                      >
                        {formData.coverImage ? (
                          <>
                            <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="text-white" size={32} />
                            </div>
                            <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                              <Check size={16} />
                            </div>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="text-zinc-400 mb-2" size={32} />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preview Cover Image</span>
                            <span className="text-[10px] text-zinc-400 mt-1">Recommended: 1200 x 400px</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                              formData.coverImage 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800 hover:bg-green-100' 
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-orange-600 hover:text-white'
                            }`}
                          >
                            {formData.coverImage ? <Check size={14} /> : <Upload size={14} />}
                            <span>{formData.coverImage ? 'Change Cover' : 'Select Cover'}</span>
                          </button>
                          {formData.coverImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, coverImage: "" }));
                                setFileNames(prev => ({ ...prev, coverImage: "" }));
                              }}
                              className="p-2 bg-zinc-100 dark:bg-zinc-800 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-zinc-200 dark:border-zinc-700"
                              title="Remove Cover"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        {fileNames.coverImage && (
                          <p className="text-[10px] text-zinc-500 truncate max-w-full font-medium">
                            {fileNames.coverImage}
                          </p>
                        )}
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={coverInputRef} 
                      name="coverImage" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">City</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">State</label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">PAN Number</label>
                  <input
                    required
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    placeholder="10-digit PAN"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Registration Certificate ID</label>
                  <input
                    required
                    type="text"
                    name="registrationCert"
                    value={formData.registrationCert}
                    onChange={handleInputChange}
                    placeholder="e.g. REG-123456"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div className="p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
                  <Upload className="mx-auto text-zinc-400 mb-2" size={32} />
                  <p className="text-sm text-zinc-500">Upload supporting documents (PDF/JPG)</p>
                  <button type="button" className="mt-4 text-orange-600 font-bold text-sm">Browse Files</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@ngo.org"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 00000 00000"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.ngo.org"
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:border-orange-600 dark:text-white"
                  />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl space-y-6">
                  {/* Branding Preview */}
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">No Cover Image</div>
                    )}
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-lg border-2 border-white dark:border-zinc-800 overflow-hidden bg-white shadow-lg">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">No Logo</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
                      <span className="text-zinc-500">Name</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
                      <span className="text-zinc-500">Category</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{formData.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
                      <span className="text-zinc-500">Location</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{formData.city}, {formData.state}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
                      <span className="text-zinc-500">Email</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{formData.email}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 italic">
                  By submitting, you agree to our terms and conditions. Your data will be verified by our team.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold hover:bg-zinc-200 transition-all"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-10 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
