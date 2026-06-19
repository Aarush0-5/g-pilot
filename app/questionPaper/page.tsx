"use client";
import { useState } from 'react';
import { questionPaperFinder } from '../backend/backend';
import axios from "axios";

interface question_paper {
  course : string,
  links: any[]
}

export default function question_paper_finder () {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<question_paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [analysedData, setAnalysedData]= useState<any>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [datatosend, setDatatosend]= useState([])
  const [revisionPlan, setRevisionPlan] = useState("")
  

 const handleSearch = async () => {
  if (!query.trim()) return;
  setLoading(true);
  setError("");
  const inputCodes = query.split(/[ ,]+/).map(c => c.trim().toUpperCase()).filter(c => c !== "");
  const combinedList = Array.from(new Set([...savedCourses, ...inputCodes]));
  setSavedCourses(combinedList);

  try {
    const response = await questionPaperFinder(combinedList);
    if (response.success) {
      setResults(response.data);
       const analysisResponse = await questionPaperFinder(inputCodes)
    const response2 = await axios.post("https://g-pilot-backend.onrender.com/analyse",
      analysisResponse.data[0]["links"]
      )
      if(response2){
        setShowAnalysis(true)
      setAnalysedData(response2.data)
      }
    } else {
      throw new Error('No papers found.');
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
    setQuery(""); 
  }
};


const clusters = Object.keys(analysedData?.topics || {}).map((id) => {
  return {
    id,
    topic: analysedData.topics[id].topic,
    frequency: analysedData.topics[id].frequency,
    keywords: analysedData.topics[id].themes
  };
});


  return (
    <div className='bg-[#0f172a] min-h-screen p-4 md:p-12 text-slate-200 font-sans'>
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Question Paper <span className="text-emerald-400">Archive</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Instantly trace and GO TO official IGNOU Question Papers PDFs.
          </p>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Make sure to double check the Question paper's code and session!
          </p>
           <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Make sure to search papers with a hyphen. Eg BECC-131!
          </p>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-500 uppercase tracking-widest">
            Unofficial Directory
          </div>
        </div>
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
      <div className="flex items-center justify-center gap-y-6 flex-col lg:gap-x-8 lg:flex-row lg:flex-wrap p-6">
        {results.map((item) => (
          <div 
            key={item.course} 
            className="w-full  bg-white text-black border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {item.course}
              </h3>
            </div>
            
            {/* Links Section */}
            <div className="flex flex-col p-4 gap-2">
              {item.links.map((link, index) => (
                <a 
                  key={index} 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-200 transition-all group"
                >
                  <span className="text-sm">Paper {index + 1}</span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>))}
        {showAnalysis && 
          <div>
        <h2 className="text-center text-xl underline underline-offset-3">Paper Analysis Section</h2>
        <p className="text-white text-center mt-2 italic text-sm mb-4">These topics were identified from past exam papers. The frequency indicates how often related questions have appeared.</p>
        <div className=" mx-auto px-4 py-8 mt-3 w-full rounded-2xl bg-blue-400 text-black min-h-screen">
          <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
            {clusters.map((c) => (
              <div 
                key={c.id} 
                className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 capitalize leading-tight">
                      {c.topic}
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 ">
                      {c.frequency} questions from all papers
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                    {c.keywords.map((q: string, index: number) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/60 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-400 group-hover:bg-blue-600 transition-colors" />
                        <p className="text-sm text-black leading-relaxed">
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
           
        </div>
          </div>}
      </div>
        
        <footer className="mt-20 pb-10 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-600 text-l">
                Information is periodically updated from publicly accessible IGNOU web pages. While efforts are made to ensure accuracy, the official IGNOU website remains the authoritative source
            </p>
            <p className="text-slate-600 text-l">
              This platform does not host, store, or distribute any PDF files. We provide a curated navigation service that redirects users to publicly accessible official IGNOU web pages via direct links.
            </p>
        </footer>

      </div>
    </div>
  );
}