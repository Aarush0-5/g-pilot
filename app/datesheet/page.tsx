"use client";
import { useEffect, useState } from 'react';
import { dateSheet } from "@/app/backend/backend";

interface ExamRow {
  date: string;
  day: string;
  courseCode: string;
  shift: string;
  rawDate: Date;
}

export default function IGNOUDatesheetFinal() {
  const [currentInput, setCurrentInput] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [finalSchedule, setFinalSchedule] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(false);

  
useEffect(() => {
  const saved = localStorage.getItem("ignou_subjects");
  if (saved) {
    setSelectedSubjects(JSON.parse(saved));
  }
}, []);


useEffect(() => {
  localStorage.setItem("ignou_subjects", JSON.stringify(selectedSubjects));
}, [selectedSubjects]);
  

  const parseIgnouDate = (dateStr: string) => {
    const pureDate = dateStr.split("\n")[0];
    const [day, month, year] = pureDate.split(".");
    return new Date(`${year}-${month}-${day}`);
  };


  const addSubject = () => {
   
    const code = currentInput.replace(/[^a-zA-Z0-9]/g, "").trim().toUpperCase();
    if (code && !selectedSubjects.includes(code)) {
      setSelectedSubjects([...selectedSubjects, code]);
      setCurrentInput("");
    }
  };

  
  const handleGenerate = async () => {
    if (selectedSubjects.length === 0) return;
    setLoading(true);

    const response = await dateSheet(selectedSubjects);
    
    if (response.success) {
      const flattenedRows: ExamRow[] = [];

      response.data.forEach((item: any) => {
        const morningBlock = item["Morning Course"].toUpperCase();
        const eveningBlock = Array.isArray(item["Evening Course"]) 
          ? item["Evening Course"].join(" ").toUpperCase() 
          : item["Evening Course"].toUpperCase();

       
        selectedSubjects.forEach(subject => {
          if (morningBlock.includes(subject)) {
            flattenedRows.push({
              date: parseIgnouDate(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              day: item.date.split("\n")[1],
              courseCode: subject,
              shift: "MORNING (10 AM)",
              rawDate: parseIgnouDate(item.date)
            });
          }
          if (eveningBlock.includes(subject)) {
            flattenedRows.push({
              date: parseIgnouDate(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              day: item.date.split("\n")[1],
              courseCode: subject,
              shift: "EVENING (2 PM)",
              rawDate: parseIgnouDate(item.date)
            });
          }
        });
      });

      
      const sorted = flattenedRows.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
      setFinalSchedule(sorted);
    }
    setLoading(false);
  };

  return (
    <div className='bg-slate-900 min-h-screen p-4 md:p-8 text-white font-sans'>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            IGNOU Datesheet Tracer
          </h1>
          <p className="text-slate-400 mt-2">Build your subject list to generate a chronological schedule.</p>
        </header>

       
        <section className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 mb-8">
          <label className="block text-sm font-medium text-slate-400 mb-2">Add Course Codes</label>
          <div className="flex flex-col lg:flex-row gap-2 mb-6">
            <input 
              className='flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all' 
              placeholder="e.g. MCS011, BCS040, BEVAE181"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubject()}
            />
            <button onClick={addSubject} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold transition-colors">
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSubjects.length === 0 && <p className="text-slate-500 italic text-sm">No subjects added yet...</p>}
            {selectedSubjects.map(s => (
              <span key={s} className="bg-slate-700 border border-slate-600 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-3">
                {s} 
                <button onClick={() => setSelectedSubjects(selectedSubjects.filter(i => i !== s))} className="text-red-400 hover:text-red-300 font-bold">x</button>
              </span>
            ))}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={selectedSubjects.length === 0 || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg"
          >
            {loading ? "Searching JSON Data..." : "Generate Final Schedule"}
          </button>
        </section>

       
        <section className="space-y-3">
          {finalSchedule.length > 0 && (
            <div className="grid grid-cols-3 px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">
              <span>Date & Day</span>
              <span className="text-center">Course</span>
              <span className="text-right">Shift</span>
            </div>
          )}

          {finalSchedule.map((exam, index) => (
            <div key={index} className="grid grid-cols-3 p-5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl items-center transition-all animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">{exam.date}</span>
                <span className="text-xs font-medium text-green-500">{exam.day}</span>
              </div>
              
              <div className="flex justify-center">
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-1 rounded-lg font-mono font-bold text-lg">
                  {exam.courseCode}
                </span>
              </div>

              <div className="text-right">
                <span className={`text-xs font-black px-3 py-1 rounded-md ${exam.shift.includes('MORNING') ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                  {exam.shift}
                </span>
              </div>
            </div>
          ))}

          {finalSchedule.length === 0 && !loading && (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-600">Your personalized datesheet will appear here.</p>
            </div>
          )}
        </section>
        <div>
          <a href="https://www.ignou.ac.in/viewFile/SED/notification/Tentative-Date-Sheet-for-June-2026-TEE.pdf" target='_blank' className='mt-10 flex justify-center hover:text-red-300 text-white font-bold text-2xl'>Go to OFFICAL source of this information</a>
        </div>
      </div>
      {finalSchedule.length > 0 && (
  <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <h3 className="text-lg font-bold text-white">Save your Schedule</h3>
      <p className="text-sm text-slate-400">Your subjects are auto-saved to this browser.</p>
    </div>
    
    <div className="flex gap-3 w-full md:w-auto">
      <button 
        onClick={() => window.print()} 
        className="flex-1 md:flex-none bg-slate-100 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
      >
        <span>PDF / Print</span>
      </button>
      
      <button 
        onClick={() => {
          localStorage.removeItem("ignou_subjects");
          setSelectedSubjects([]);
          setFinalSchedule([]);
        }} 
        className="flex-1 md:flex-none bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
      >
        Clear All
      </button>
    </div>
  </div>
)}
    </div>
  );
}