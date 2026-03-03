"use client";

import { useState } from "react";
import { analyzeSituation } from "../backend/backend";
import { Briefcase, Target, GraduationCap, TrendingUp, ChevronRight } from "lucide-react";

interface FutureOption {
  course: string;
  eligibility: string;
  universities: string;
}

interface CareerData {
  industry: string,
  suggestedRoles: string[],
  gapSkills: string[],
  future_options: FutureOption[]
}



export default function careerGoal() {
const [courseInput, setCourseInput] = useState("");
   const [courses, setCourses]= useState<string []>([])
   const [aiReply , setAiReply] = useState<string> ("")
   const [aiData, setAiData] = useState<CareerData | null>(null);
   const [loading, setLoading] = useState(false);
   const [extraQuestion, setExtraQuestion] = useState("");
  const [extraAnswer, setExtraAnswer] = useState<string>("");
  const [extraAnswerLoading, setExtraAnswerLoading] =useState (false)


    const addCourse = () => {
    if (courseInput.trim() && !courses.includes(courseInput.toUpperCase())) {
      setCourses([...courses, courseInput.toUpperCase().trim()]);
      setCourseInput("");
    }
  };

  const getAiRoadmap = async () => {
    if (courses.length === 0) return;
    setLoading(true);
    try {
      const response = await analyzeSituation(courses)
      const data = await response.data;
      setAiData(data);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Career Architect
        </h1>
        <p className="text-gray-400 mb-8 italic border-l-4 border-yellow-500 pl-4">
          NOTE: This tool uses AI to simulate career trajectories. It is for inspiration and not professional legal/academic advice.
        </p>

        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Add course (e.g. MCS-011)" 
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCourse()}
          />
          <button onClick={addCourse} className="bg-blue-600 px-4 py-2 rounded-lg font-bold">+</button>
        </div>

      
        <div className="flex flex-wrap gap-2 mb-8">
          {courses.map(c => (
            <span key={c} className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-700">
              {c}
            </span>
          ))}
        </div>

        <button 
          onClick={getAiRoadmap}
          disabled={loading || courses.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-xl font-bold text-xl hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing Market Data..." : "Generate My Future Roadmap ✨"}
        </button>

        
        {aiData && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Main Industry & Role Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Briefcase size={120} />
        </div>
        
        <div className="relative z-10">
          <span className="text-blue-500 font-bold tracking-widest text-xs uppercase italic">Sector Analysis</span>
          <h2 className="text-4xl font-extrabold text-white mt-2 mb-4">
            {aiData.industry}
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {aiData.suggestedRoles.map((role) => (
              <div key={role} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
                <Target size={14} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-100">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-6 text-orange-400">
            <TrendingUp size={20} />
            <h3 className="font-bold text-lg uppercase tracking-tight">The "Gap" Skills</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">To be competitive in {aiData.industry}, master these alongside your IGNOU degree:</p>
          <div className="space-y-3">
            {aiData.gapSkills.map((skill) => (
              <div key={skill} className="flex items-center justify-between bg-orange-500/5 border border-orange-500/10 p-3 rounded-xl hover:border-orange-500/40 transition-colors">
                <span className="text-orange-100 font-medium">{skill}</span>
                <span className="text-[10px] bg-orange-500 text-black px-2 py-0.5 rounded font-black">REQUIRED</span>
              </div>
            ))}
          </div>
        </div>

        
       
<div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
  <div className="flex items-center gap-2 mb-6 text-emerald-400">
    <GraduationCap size={20} />
    <h3 className="font-bold text-lg uppercase tracking-tight">Post-Degree Roadmap</h3>
  </div>
  <div className="relative border-l-2 border-slate-800 ml-3 space-y-6">
    {aiData.future_options.map((option, i) => (
      <div key={i} className="relative pl-8">
        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        
        {/* FIX: Render specific properties instead of the whole object */}
        <div className="font-bold text-slate-100">{option.course}</div>
        <div className="text-xs text-emerald-400 mt-1 uppercase tracking-wider font-bold">
          Eligibility: {option.eligibility}
        </div>
        <div className="text-sm text-slate-400 mt-1">
          Top Universities: {option.universities}
        </div>
        
        <ChevronRight size={14} className="text-slate-600 mt-2" />
      </div>
    ))}
  </div>
</div>
     
      <div className="text-center p-4">
        <p className="text-slate-500 text-xs italic">
          AI-Generated Career Path based on current IGNOU Curriculum Data
        </p>
      </div>
    </div>
    </div>
        )}

       
      </div>
      </div>
    
  );
}