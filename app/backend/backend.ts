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
      
      const morning = item["morning"] || "";
      
      const evening = Array.isArray(item["evening"]) 
                      ? item["evening"].join(" ") 
                      : (item["evening"] || "");

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
        3. Include future study oppertunities including the courses, their general eligibility criteria listed by universities and locations where it can be studied based on the current course of the student, Keep the first few options directly related to their courses and the last few extra ones which they can still pursue regardless of their course for example UPSC.
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

export const questionPaperFinder = async (userCourses: string[]) => {
  const filePath = path.join(process.cwd(), "app", "backend", "questionPaper.json");
  const baseLinks = [`https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20June%202024/CBCS/`,`https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20December%202023/CBCS/`,  `https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20June%202023/CBCS/`, `https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20December%202022/CBCS/`,`https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20June%202022/CBCS/`, `https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20December%202021/CBCS/` , `https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20June%202021/CBCS/`,  ]

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const finalResults = userCourses.flatMap((course) => {
      const normalizedCourse = course.toUpperCase();
      const otherEntry = data.others?.find((item: any) => 
       item.courseCode.toUpperCase() === normalizedCourse
      );
      const suffix = otherEntry ? otherEntry.link : null;
      const generatedUrls = suffix 
        ? baseLinks.map(base => `${base}${suffix}`) 
        : [];


      const sessionLinks = Object.entries(data)
        .filter(([session]) => session !== "others")
        .flatMap(([session, papers]: [string, any]) => {
          return papers
            .filter((p: any) => p.courseCode.toUpperCase() === normalizedCourse)
            .map((p: any) => (
              p.link
            ));
        });

      const final_links = [...sessionLinks, ...generatedUrls]
      return {
        course: normalizedCourse,
        links: final_links
      };
    });
    return { success: true, data: finalResults };
  } catch (error) {
    console.error("Search failed:", error);
    return { success: false, data: [] };
  }
};
