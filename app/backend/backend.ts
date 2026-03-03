"use server"
import fs from "node:fs/promises";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const assignmentFinder = async (courses: string[]) => {
  const filePath = path.join(process.cwd(),"app", "backend", "assignment.json");
  const fileData = await fs.readFile(filePath, "utf-8");
  const allAssignments = JSON.parse(fileData);
  try {
  const filteredResults = allAssignments.filter((item: any) => 
     courses.some(course => item.course.toUpperCase().includes(course.toUpperCase()))
    );
  return { success: true, data: filteredResults };
  } catch (error) {
    console.error("Filtering Error:", error);
    return { success: false, error: "Could not read assignment data." };
  }
}

export const dateSheet = async (courses: string[]) => {
  const filePath = path.join(process.cwd(), "app", "backend", "datasheet.json");
  const fileData = await fs.readFile(filePath, "utf-8");
  const allAssignments = JSON.parse(fileData);

  try {
    const filteredResults = allAssignments.filter((item: any) => {
      
      const morning = item["Morning Course"] || "";
      
      const evening = Array.isArray(item["Evening Course"]) 
                      ? item["Evening Course"].join(" ") 
                      : (item["Evening Course"] || "");

      const allSessionCourses = (morning + " " + evening).toUpperCase();

      
      return courses.some(course => {
        if (!course) return false;
        const searchCode = course.toUpperCase().trim();
        return allSessionCourses.includes(searchCode);
      });
    });

    const sortedResults = filteredResults.sort((a: any, b: any) => {
  const [dayA, monthA, yearA] = a.date.split("\n")[0].split(".");
  const [dayB, monthB, yearB] = b.date.split("\n")[0].split(".");
  
 
  const valA = `${yearA}${monthA}${dayA}`;
  const valB = `${yearB}${monthB}${dayB}`;
  
  return valA.localeCompare(valB);
});

    return { success: true, data: sortedResults };
  } catch (error) {
    console.error("Filtering Error:", error);
    return { success: false, error: "Could not filter date sheet." };
  }
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export async function analyzeSituation(courses: string[]) {
  try {
  
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
     Act as a Professional Career Counselor specialized in Indian Higher Education (IGNOU).
        I will provide you with a JSON list of courses a student is enrolled in. 
        Your task:
        1. Identify the core industry these courses belong to (e.g., IT, Social Work, Management).
        2. Suggest a few specific job roles the student can apply for after completing these.
        3. Include future study oppertunities including the courses, their general eligibility criteria and locations where it can be studied based on the current course of the student, Keep the first few options directly related to their courses and the last few extra ones which they can still pursue regardless of their course for example UPSC.
        3. List 2 "Gap Skills" (skills not taught in these courses but required by the industry).
        STUDENT DATA:
        ${JSON.stringify(courses)}

        OUTPUT FORMAT (JSON):
        {
          "industry": "...",
          "suggestedRoles": ["...", "...", "..."],
          "gapSkills": ["...", "..."],
          "future_options": [{"course": "...", "elgibility": "...", "universities": "..."}]
        }

        Strictly return ONLY the JSON object. Do not include markdown formatting or extra text.
    `;

   
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanedText);

    return { success: true, data: analysis };

  } catch (error) {
    console.error("AI Error:", error);
    return { success: false, error: "The AI is overthinking. Try again!" };
  }
}

