import { GoogleGenAI } from "@google/genai";
import { StudentData } from "../types";
import { calculateTotal, getGradeInfo } from "../utils";

export const generateRemarks = async (student: StudentData): Promise<{ teacherRemark: string; headRemark: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a prompt based on student data
    const performanceSummary = student.subjects.map(s => {
      const total = calculateTotal(s.caScore, s.examScore);
      const grade = getGradeInfo(total);
      return `${s.name}: ${total}/100 (${grade.grade})`;
    }).join(', ');

    const conductSummary = student.conducts.map(c => `${c.name}: ${c.rating || 'N/A'}`).join(', ');

    const prompt = `
      You are an experienced preschool teacher writing report card remarks.
      
      Student Name: ${student.fullName}
      Gender: ${student.gender}
      
      Academic Performance:
      ${performanceSummary}
      
      Conduct:
      ${conductSummary}
      
      Attendance: Present ${student.timesPresent}/${student.schoolOpened} days.
      
      Task:
      1. Write a "Class Teacher's Remark" (max 30 words). It should be encouraging, highlighting specific strengths based on the data, and gently mentioning areas for improvement if scores are low. Use "He/She" appropriately based on gender.
      2. Write a "Head of School's Remark" (max 10 words). Short, punchy, positive endorsement like "Excellent progress!" or "Good effort shown."
      
      Output Format (JSON):
      {
        "teacherRemark": "...",
        "headRemark": "..."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating remarks:", error);
    throw error;
  }
};