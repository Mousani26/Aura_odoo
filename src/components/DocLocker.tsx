import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, FileText, Upload, Eye, Download, Search, Shield, Trash2, CheckCircle2, Lock } from "lucide-react";

interface VaultDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  category: string;
}

export default function DocLocker() {
  const [documents, setDocuments] = useState<VaultDocument[]>([
    { id: "vdoc-1", name: "Digital_Employment_Agreement_2026.pdf", size: "2.4 MB", uploadedAt: "2026-07-01", category: "Agreements" },
    { id: "vdoc-2", name: "NDA_and_IPR_Intellectual_Asset_Policy.pdf", size: "1.8 MB", uploadedAt: "2026-07-01", category: "Policies" },
    { id: "vdoc-3", name: "Aura_Core_Security_Briefing_v3.pdf", size: "940 KB", uploadedAt: "2026-07-02", category: "Briefings" },
    { id: "vdoc-4", name: "Offer_Letter_Aarav_Patel.pdf", size: "2.1 MB", uploadedAt: "2023-10-15", category: "Agreements" },
    { id: "vdoc-5", name: "Form_16_Tax_Statement_2026.pdf", size: "420 KB", uploadedAt: "2026-01-10", category: "Finance" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (files: FileList) => {
    const newDocs: VaultDocument[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      newDocs.push({
        id: `vdoc-${Date.now()}-${i}`,
        name: file.name,
        size: `${sizeMB} MB`,
        uploadedAt: new Date().toISOString().split("T")[0],
        category: "User Upload"
      });
    }
    setDocuments(prev => [newDocs[0], ...prev]);
    showToast(`Successfully uploaded ${files[0].name} into AES-256 secure locker.`);
  };

  const handleDelete = (id: string, name: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    showToast(`Removed "${name}" from secure locker.`);
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="doc-locker" className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-mono"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> Secure Document Locker
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Store and manage critical company papers, identity proofs, tax filings, and legal agreements.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vault files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Upload & Security Notice */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Upload Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
              dragActive
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInput}
              multiple
            />
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4 text-indigo-400 shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Upload Secure Documents</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Drag and drop files here, or <span className="text-indigo-400 font-semibold underline">click to browse</span>
            </p>
            <p className="text-[9px] text-slate-500 mt-3 uppercase tracking-wider font-bold">
              Supports: PDF, DOCX, PNG up to 10MB
            </p>
          </div>

          {/* AES-256 Digital Locker Details */}
          <div className="bg-[#080000] border border-slate-850 p-4 rounded-2xl space-y-3 shadow-inner">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" /> AES-256 Digital Locker
            </h4>
            <p className="text-[11px] leading-normal text-[#ffffff]">
              All uploads are automatically processed, digitized, and watermarked. Document access logs are dispatched in real-time to HR audit files.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#e5e4e4] bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>SLA Level-3 Enforced Clearance</span>
            </div>
          </div>

        </div>

        {/* Right Side: Documents List */}
        <div className="lg:col-span-7 bg-[#3f8b89] border border-slate-800 p-4 rounded-3xl space-y-4">
          <div className="flex justify-between items-center px-1 border-b border-slate-850 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Vault Documents</h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
              {filteredDocs.length} Total Files
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs italic">
                No secure vault documents match your search.
              </div>
            ) : (
              filteredDocs.map(doc => (
                <div
                  key={doc.id}
                  className="bg-slate-950/80 hover:bg-slate-900/40 border border-slate-850 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-bold text-xs text-slate-200 truncate pr-4 group-hover:text-indigo-300 transition-colors">
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {doc.size} • <span className="text-slate-400">Uploaded: {doc.uploadedAt}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => showToast(`Opening secure viewer for "${doc.name}"...`)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                      title="View Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => showToast(`Decrypting and starting secure download of "${doc.name}"...`)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 hover:border-rose-950/30 transition-all cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
