import { GoogleGenAI } from "@google/genai";
import { StudentData } from "../types";
import { calculateTotal, getGradeInfo } from "../utils";

type Remarks = { teacherRemark: string; headRemark: string };

export const generateRemarks = async (student: StudentData): Promise<Remarks> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment');

    const ai: any = new GoogleGenAI({ apiKey });

    const performanceSummary = student.subjects.map(s => {
      const total = calculateTotal(s.caScore, s.examScore);
      const grade = getGradeInfo(total);
      return `${s.name}: ${total}/100 (${grade.grade})`;
    }).join(', ');

    const conductSummary = (student.conducts || []).map(c => `${c.name}: ${c.rating || 'N/A'}`).join(', ');

    const prompt = `You are an experienced preschool teacher writing report card remarks.\n\nStudent Name: ${student.fullName}\nGender: ${student.gender}\n\nAcademic Performance:\n${performanceSummary}\n\nConduct:\n${conductSummary}\n\nAttendance: Present ${student.timesPresent}/${student.schoolOpened} days.\n\nTask:\n1. Write a \"Class Teacher's Remark\" (max 30 words). It should be encouraging, highlighting specific strengths based on the data, and gently mentioning areas for improvement if scores are low. Use \"He/She\" appropriately based on gender.\n2. Write a \"Head of School's Remark\" (max 10 words). Short, punchy, positive endorsement like \"Excellent progress!\" or \"Good effort shown.\"\n\nOutput Format (JSON):\n{\n  \"teacherRemark\": \"...\",\n  \"headRemark\": \"...\"\n}`;

    // Call the GenAI client. The exact response shape can vary between SDK versions; be defensive.
    const response: any = await ai.models?.generateContent
      ? await ai.models.generateContent({ model: 'gemini-2.5', contents: prompt, config: { responseMimeType: 'application/json' } })
      : await ai.generate?.({ model: 'gemini-2.5', prompt });

    // Try several common response shapes to extract text/json
    let text: string | undefined;
    if (response == null) throw new Error('No response from AI');
    if (typeof response === 'string') text = response;
    if (!text && response.text) text = response.text;
    if (!text && response.outputText) text = response.outputText;
    if (!text && response.output?.[0]?.content) {
      const content = response.output[0].content;
      const outText = Array.isArray(content) ? content.map((c: any) => c.text || c.display || '').join('') : content.text;
      text = outText;
    }

    if (!text) {
      // Last resort: stringify and try to find JSON inside
      const raw = JSON.stringify(response);
      const m = raw.match(/\{\s*\"teacherRemark\"[\s\S]*\}/);
      text = m ? m[0] : raw;
    }

    let parsed: Remarks;
    try {
      parsed = typeof text === 'string' ? JSON.parse(text) : text;
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON: ' + (e as Error).message + '\nResponse: ' + text);
    }

    if (!parsed.teacherRemark || !parsed.headRemark) {
      throw new Error('AI response did not contain expected fields');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating remarks:', error);
    throw error;
  }
};