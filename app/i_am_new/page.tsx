'use client'
import { useState } from "react";


export default function IamNew() {
 const [rating, setRating] = useState("");
  return (
   <div className="bg-[#0f172a] text-white">
        <div className="p-6  mx-auto font-sans">
        <h1 className="text-3xl text-center font-bold mb-2">I am NEW 🐣</h1>
        <p className="text-gray-100 text-center mb-8">Here are the general checkboxes you need to fill up to stay on top of your timeline.</p>

        <div className="space-y-8">
            
        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Got the confirmation mail? 📩</h3>
                <p className="text-gray-200">You should receive a confirmation mail on your ID. If you haven't received it yet, wait for it—I got mine quite late too! Check your spam folder just in case.</p>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Download your ID card 🪪</h3>
                <p className="text-gray-200">At the end of your mail, you will have your ID card attached.</p>
            </div>
            </section>

        
            <section className="flex gap-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold text-blue-700">NEW: Create and Link your ABC ID (Mandatory!) ✨</h3>
                <p className="text-blue-900 text-sm">As of 2026, you MUST create an Academic Bank of Credits ID via DigiLocker and link it to your profile. Without this, your marks won't be updated. Do this before the next step!</p>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Sign up on the SAMARTH Portal 💻</h3>
                <p className="text-gray-200 mb-2">This is your main dashboard for everything. Keep your login details safe.</p>
                <a target="_blank" href="https://ignou.samarth.edu.in/index.php/site/login" className="text-blue-600 font-medium underline">Direct link to SAMARTH portal →</a>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Wait for an induction meeting mail/message 📢</h3>
                <p className="text-gray-200">Your regional/study center will invite you for a meeting (Online or Offline) where they introduce the course. It is a great place to ask "stupid" questions. (If you for any reason miss it, visit your regional center or study center later on!)</p>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Visit your Study Center once 🏃‍♂️</h3>
                <p className="text-gray-200">Go introduce yourself to the coordinator. Ask them how they prefer assignments (Files vs. Spiral) and if there are any official WhatsApp groups for your center.</p>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Start STUDYING! 📖</h3>
                <p className="text-gray-200">If you opted for physical books, great! But while they are "on the way" (which can take months), start using the online PDFs from <strong>eGyanKosh</strong> or the IGNOU e-Content app.</p>
            </div>
            </section>

            
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Download your assignments 📝</h3>
                <p className="text-gray-200"> You can use my <strong>Assignment Finder</strong> to get the official PDF links directly.</p>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Look out for the Exam Form window 🎟️</h3>
                <p className="text-gray-200">You have to pay for exams separately </p>
            </div>
            </section>

        
            <section className="flex gap-4">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Get your Datesheet and Hall Ticket 🗓️</h3>
                <p className="text-gray-200">The "Tentative" datesheet comes out first (for planning), but the final Hall Ticket only drops about 7-10 days before the exams.</p>
            </div>
            </section>

            {/* 11. Re-Registration */}
            <section className="flex gap-4 border-t pt-6">
            <input type="checkbox" className="w-6 h-6 mt-1" />
            <div>
                <h3 className="text-xl font-bold">Check for the Re-Registration window! 🔄</h3>
                <p className="text-gray-200">Crucial: You need to register for your 2nd year/semester <strong>even before</strong> you get the results for the 1st year. Don't miss this, or you'll lose 6 months!</p>
            </div>
            </section>

        </div>
  
     <div className="mt-10">
        <h2 className="text-2xl text-center mb-4">So how was your experience so far?</h2>
          <form action="https://formspree.io/f/xyknzkle" method="POST" className="max-w-md mx-auto">  
          <input type="hidden" name="rating" value={rating} />
          <div className="flex justify-center gap-4 mb-6">
            {['Sweet', 'Mid', 'Weird'].map((r) => (
            <button
                type="button" 
                key={r}
                onClick={() => setRating(r)}
                className={`px-4 py-2 border rounded-full transition ${rating === r ? 'bg-white text-black' : 'border-white'}`}
            >
                {r}
            </button>
            ))}
          </div>
            <textarea name="message" placeholder="Drop a rant or a suggestion here..." className="w-full p-3 rounded-lg text-white mb-4" required />
            <div className="flex justify-center"> 
               <button type="submit" className="bg-blue-600 px-6  py-2 rounded-full font-bold">Send Feedback</button>
            </div>
            </form>
        </div>
    
        </div>
   </div> 
  )
}