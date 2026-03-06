"use client";
import { useState } from 'react';

export default function Home() {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans">
      <header className="bg-slate-900/50 border-b border-slate-800 p-8 text-center backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          IGNOU <span className="text-emerald-400">Task Manager</span>
        </h1>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <section className="mb-16">
          <h2 className="text-center text-2xl font-bold mb-8 text-slate-100">Quick Utility Tools</h2>
          <h3 className="text-center text-xl italic font-bold mb-8 text-slate-100">last updated : 3rd March 2026</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "DateSheet Sorter", href: "/datesheet", desc: "Order your exams chronologically" },
              { label: "Assignment Finder", href: "/assignmentfinder", desc: "Trace official PDF links" },
              { label: "Career Guidance", href: "/careerGoal", desc: "Post-graduation pathways" }
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="group p-6 bg-slate-800/40 border border-slate-700 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 shadow-xl"
              >
                <h3 className="text-emerald-400 text-center font-bold text-lg group-hover:underline">{item.label}</h3>
                <p className="text-slate-500 text-center text-sm mt-2">{item.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-center text-2xl font-bold mb-8 text-slate-100">Official IGNOU Resources</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { name: "Official Website", url: "https://www.ignou.ac.in" },
              { name: "Result Portal", url: "https://www.ignou.ac.in/pages/60" },
              { name: "Assignments Page", url: "https://www.ignou.ac.in/studentService/download/assignments" }
            ].map((link) => (
              <a 
                key={link.name}
                href={link.url} 
                target="_blank" 
                className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-medium"
              >
                {link.name} ↗
              </a>
            ))}
          </div>
        </section>

        
    
<section className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-8 md:p-10 shadow-inner">
 <div className="grid md:grid-cols-2 gap-8 text-slate-400 text-sm leading-relaxed">
  <div className="space-y-4">
    <p>
      <span className="text-white font-bold">1. Non-Affiliation:</span> This website is an independent student project. It is <span className="text-red-400 underline">not</span> an official portal of IGNOU, nor is it endorsed, authorized, or supported by the University.
    </p>
    <p>
      <span className="text-white font-bold">2. Data Sourcing:</span> The information displayed (Dates, Sessions, and Links) is <span className="text-emerald-400 font-bold">extracted from public official IGNOU documents</span>. While we provide a filtered interface for easier viewing, the source of truth remains the official University announcements.
    </p>
  </div>
  <div className="space-y-4">
    <p>
      <span className="text-white font-bold">3. No File Hosting:</span> This platform <span className="text-white italic">does not host or redistribute</span> official PDF documents. Our system only maintains a <span className="text-white font-bold">directory of public web-links</span>. When you click "View PDF," you are accessing the original file directly from IGNOU's own servers.
    </p>
    <p>
      <span className="text-white font-bold">4. Verification Required:</span> Automated data parsing can occasionally result in errors. <span className="text-amber-400 font-bold">Users must cross-verify all dates and codes with the official IGNOU website (ignou.ac.in) before exams or submissions.</span> Use this tool at your own risk.
    </p>
  </div>
</div>

  <div className="mt-8 pt-6 border-t border-slate-800 text-center">
   <a href="mailto:spysinner01@gmail.com">
  <button className="text-white mt-4 mb-5 rounded-xl p-3 border hover:border-red hover:border-solid hover:text-red-500 " type="button">Mail the Developer</button>
</a>
    <p className="text-slate-500 text-[10px] uppercase tracking-widest">
      Navigation Tool Only • Built for students • © 2026
    </p>
  </div>
</section>
      </main>
    </div>
  );
}