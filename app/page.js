export const dynamic = 'force-dynamic';
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Universities List
const UNIVERSITIES = [
  { id: "colombo", name: "University of Colombo", logo: "/logos/colombo.png" },
  { id: "peradeniya", name: "University of Peradeniya", logo: "/logos/peradeniya.png" },
  { id: "sjp", name: "University of Sri Jayewardenepura", logo: "/logos/sjp.png" },
  { id: "kelaniya", name: "University of Kelaniya", logo: "/logos/kelaniya.png" },
  { id: "moratuwa", name: "University of Moratuwa", logo: "/logos/moratuwa.png" },
  { id: "ruhuna", name: "University of Ruhuna", logo: "/logos/ruhuna.png" },
  { id: "jaffna", name: "University of Jaffna", logo: "/logos/jaffna.png" },
  { id: "eastern", name: "Eastern University", logo: "/logos/eastern.png" },
  { id: "sabaragamuwa", name: "Sabaragamuwa University", logo: "/logos/sabaragamuwa.png" },
  { id: "rajarata", name: "Rajarata University", logo: "/logos/rajarata.png" },
  { id: "uwu", name: "Uva Wellassa University", logo: "/logos/uwu.png" },
  { id: "vavuniya", name: "University of Vavuniya", logo: "/logos/vavuniya.png" },
  { id: "wayamba", name: "Wayamba University", logo: "/logos/wayamba.png" },
  { id: "ocean", name: "Ocean University of Sri Lanka", logo: "/logos/ocean.png" },
];

// Quick Categories
const CATEGORIES = [
  { name: "All Faculties", icon: "🎓" },
  { name: "Computing & IT", icon: "💻" },
  { name: "Engineering", icon: "⚙️" },
  { name: "Management & Business", icon: "📊" },
  { name: "Medicine & Health", icon: "🩺" },
  { name: "Science & Technology", icon: "🔬" },
];

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUniFilter, setSelectedUniFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Faculties");
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState(UNIVERSITIES[0].name);
  const [faculty, setFaculty] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("1st Year");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error.message);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert("කරුණාකර විස්තර සහ PDF එක ඇතුළත් කරන්න.");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("papers")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("papers")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("papers").insert([
        {
          title,
          university,
          faculty,
          subject,
          academic_year: year,
          file_url: urlData.publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      alert("සාර්ථකව Upload විය!");
      setTitle("");
      setFaculty("");
      setSubject("");
      setFile(null);
      fetchFiles();
    } catch (err) {
      alert("Upload කිරීමට නොහැකි විය: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter((item) => {
    const matchesUni =
      selectedUniFilter === "all" || item.university === selectedUniFilter;
    const matchesCategory =
      selectedCategory === "All Faculties" ||
      item.faculty?.toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0]);
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.faculty?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUni && matchesCategory && matchesSearch;
  });

  const getUniLogo = (uniName) => {
    const found = UNIVERSITIES.find((u) => u.name === uniName);
    return found ? found.logo : null;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-inner">
        🚀 Welcome to UniHub Sri Lanka — The Ultimate Open Resource Center for University Students!
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30">
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                UniHub <span className="text-blue-600">LK</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Sri Lanka Higher Education Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#upload-section"
              className="hidden sm:inline-flex bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors border border-blue-200"
            >
              📤 Upload Paper
            </a>
            <a
              href="/admin"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-slate-900/20"
            >
              🔐 Admin Portal
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200')] bg-cover bg-center"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-sm">
            📚 Free Access to Past Papers, Lecture Notes & Model Papers
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Empowering Sri Lankan <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Undergraduates Together
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Find and share academic resources across 14+ Sri Lankan State Universities. Ace your semester exams with ease.
          </p>

          {/* Search Bar in Hero */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2">
              <span className="text-slate-400 pl-4 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search subject, module, degree or paper name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 text-slate-800 text-sm focus:outline-none bg-transparent"
              />
              <button
                onClick={() => {
                  const el = document.getElementById("documents-list");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <p className="text-3xl font-black text-blue-400">{files.length}</p>
              <p className="text-xs text-slate-400 font-medium">Available Papers</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <p className="text-3xl font-black text-teal-400">14+</p>
              <p className="text-xs text-slate-400 font-medium">Universities</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <p className="text-3xl font-black text-purple-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Free Access</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <p className="text-3xl font-black text-amber-400">24/7</p>
              <p className="text-xs text-slate-400 font-medium">Community Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Categories Bar */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Browse by Faculty
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* University Filter Grid */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              🏛️ Select University
            </h3>
            <button
              onClick={() => setSelectedUniFilter("all")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Reset Filter
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedUniFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedUniFilter === "all"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Universities ({UNIVERSITIES.length})
            </button>
            {UNIVERSITIES.map((uni) => (
              <button
                key={uni.id}
                onClick={() => setSelectedUniFilter(uni.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedUniFilter === uni.name
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <img
                  src={uni.logo}
                  alt={uni.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span>{uni.name.replace("University of ", "").replace(" University", "")}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Two Column Grid: Upload Form + Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Upload Form (Sticky Sidebar on Desktop) */}
          <div
            id="upload-section"
            className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 sticky top-28"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold">
                📥
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Past Paper</h3>
                <p className="text-xs text-slate-500">Help fellow batch mates by sharing notes</p>
              </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023 Data Structures Exam Paper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  University *
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                  {getUniLogo(university) && (
                    <img
                      src={getUniLogo(university)}
                      alt={university}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium text-slate-800"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Faculty / School
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computing / Engineering"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50 font-medium"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PDF Document *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer bg-slate-50 p-2 rounded-xl border border-dashed border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:bg-slate-400 mt-2 text-sm"
              >
                {uploading ? "Uploading Document..." : "🚀 Publish Document"}
              </button>
            </form>
          </div>

          {/* Document List */}
          <div id="documents-list" className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Document Repository
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredFiles.length} uploaded files
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <div className="inline-block animate-spin text-3xl">🔄</div>
                <p className="text-slate-500 font-medium text-sm">Fetching latest documents...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
                <div className="text-5xl">📁</div>
                <h4 className="text-lg font-bold text-slate-800">No documents found</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                  We couldn't find any past papers matching your search or filters. Be the first to upload one!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredFiles.map((doc) => {
                  const logoPath = getUniLogo(doc.university);
                  return (
                    <div
                      key={doc.id}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        {logoPath ? (
                          <img
                            src={logoPath}
                            alt={doc.university}
                            className="w-14 h-14 object-contain bg-slate-50 p-2 rounded-2xl border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div className="w-14 h-14 bg-blue-100 text-blue-700 font-bold rounded-2xl flex items-center justify-center text-2xl shrink-0">
                            📄
                          </div>
                        )}

                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-blue-700 font-semibold">
                            {doc.university}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {doc.subject && (
                              <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                                📚 {doc.subject}
                              </span>
                            )}
                            {doc.academic_year && (
                              <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                                🎓 {doc.academic_year}
                              </span>
                            )}
                            {doc.faculty && (
                              <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                                🏢 {doc.faculty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 shrink-0"
                      >
                        <span>View / Download</span> ↗
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h4 className="text-white text-lg font-bold">UniHub LK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sri Lanka's dedicated open academic library. Access past papers, lecture slides, and tutorials freely.
            </p>
          </div>
          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#upload-section" className="hover:text-white transition-colors">Upload Past Paper</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Universities</h5>
            <p className="text-xs leading-relaxed">
              Colombo, Peradeniya, Moratuwa, Sri Jayewardenepura, Ruhuna, Kelaniya, Jaffna & more.
            </p>
          </div>
          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Community</h5>
            <p className="text-xs leading-relaxed">
              Created for students, by students. Built for higher education excellence in Sri Lanka.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-xs">
          © 2026 UniHub Sri Lanka. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
