"use client";
import { useState } from 'react';
import { assignmentFinder } from '../backend/backend';

interface Assignment {
  course: string;
  pdf_url: string;
  session: string;
}

export default function AssignmentFinder() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedCourses, setSavedCourses] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    const cleanedInput = query
      .split(/[ ,]+/)
      .map(c => c.trim().toUpperCase())
      .filter(c => c !== "" && !savedCourses.includes(c));
    
    if (cleanedInput.length === 0 && savedCourses.length === 0) {
        setLoading(false);
        return;
    };
    
    const newCourseList = [...savedCourses, ...cleanedInput];
    setSavedCourses(newCourseList);

    try {
      const response = await assignmentFinder(newCourseList);
      if (!response.success) {
        throw new Error('No assignments found for these codes.');
      }
      const data = await response.data;
      setResults(data);
    } catch (err: any) {
      setResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#0f172a] min-h-screen p-4 md:p-12 text-slate-200 font-sans'>
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Assignment <span className="text-emerald-400">Archive</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Instantly trace and GO TO official IGNOU assignment PDFs.
          </p>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Make sure to double check the assignment dates and code before using them!
          </p>
           <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Make sure to search assinments with a hyphen. Eg BECC-131!
          </p>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-500 uppercase tracking-widest">
            Unofficial Directory
          </div>
        </div>

        {/* Search Bar Area */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative flex-col lg:flex-row flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <input 
              className='flex-1 bg-transparent p-4 pl-6 text-white outline-none placeholder:text-slate-600' 
              type="text" 
              value={query}
              placeholder="Enter course codes (e.g. MCS-011, BEVAE-181)" 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-emerald-500 text-emerald-950 font-bold px-8 py-4 rounded-xl hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-emerald-900/30 border-t-emerald-900 rounded-full animate-spin"></div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Saved Badges */}
        {savedCourses.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {savedCourses.map((c) => (
              <span key={c} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-emerald-400">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="mt-12 grid gap-4">
          {results.map((item, index) => (
            <div 
              key={index} 
              className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 p-5 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
                  {item.course.substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl tracking-tight uppercase">{item.course}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="text-slate-400 text-sm font-medium">{item.session}</p>
                  </div>
                </div>
              </div>
              
              <a 
                href={item.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3 bg-slate-700 hover:bg-emerald-500 text-white hover:text-emerald-950 rounded-xl font-bold text-sm transition-all duration-300"
              >
                GO TO OFFICIAL PDF
              </a>
            </div>
          ))}

        
          {!loading && results.length === 0 && !error && (
            <div className="mt-10 text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500">Your assignment links will appear here after searching.</p>
            </div>
          )}
        </div>

        
        <footer className="mt-20 pb-10 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-600 text-xs">
                Information is periodically updated from publicly accessible IGNOU web pages. While efforts are made to ensure accuracy, the official IGNOU website remains the authoritative source
            </p>
        </footer>

      </div>
    </div>
  );
}