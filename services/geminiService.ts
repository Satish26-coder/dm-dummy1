
import { GoogleGenAI, Type } from "@google/genai";
import { TestCase, ProjectFile, CompilationResponse, LabType, LabSession } from '../types';

const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

// ... (keep existing runCodeSimulation)

export const runCodeSimulation = async (
  files: ProjectFile[],
  labType: LabType,
  testCases: TestCase[]
): Promise<CompilationResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      compileError: "API Key is missing. Please check your environment configuration.",
      results: []
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  // Serialize files for the prompt
  const fileContext = files.map(f => `
--- FILE: ${f.name} (${f.language}) ---
${f.content}
  `).join('\n');

  let specializedInstruction = "";
  if (labType === 'frontend') {
    specializedInstruction = `
      This is a FRONTEND project.
      The code consists of HTML, CSS, and JS.
      For each test case, verify if the Code meets the requirement described in the "input" field (e.g. "Check if h1 exists").
      You need to analyze the DOM structure implied by the HTML and styles applied by CSS.
      If "input" asks about visual style, infer it from CSS.
      The "expectedOutput" is usually "True" or "Found".
    `;
  } else if (labType === 'database') {
    specializedInstruction = `
      This is a DATABASE project.
      The code is likely SQL.
      The "input" in test cases is the Description of the query result or the Query itself to run against a hypothetical database defined by the schema (if provided in files).
      Simulate the execution of the SQL query.
      Compare the result set with "expectedOutput".
    `;
  } else {
    specializedInstruction = `
      This is a ${labType.toUpperCase()} project.
      Simulate compiling/interpreting the code (e.g. Python, JS, Java, C++, C).
      Run the "input" against the main logic and compare with "expectedOutput".
    `;
  }

  const prompt = `
    You are a code execution engine and grader for a student IDE.
    
    LAB TYPE: ${labType}

    PROJECT FILES:
    ${fileContext}

    TEST CASES:
    ${JSON.stringify(testCases.map(tc => ({ id: tc.id, descriptionOrInput: tc.input })))}

    EXPECTED OUTPUTS:
    ${JSON.stringify(testCases.map(tc => ({ id: tc.id, expected: tc.expectedOutput })))}

    INSTRUCTIONS:
    1. Check for syntax errors across all files. If fatal errors exist, return 'success': false.
    2. ${specializedInstruction}
    3. Provide the result for each test case.
    4. IF there are errors (compilation or failed test cases), provide a helpful "debugInstructions" string.
       - Explain WHY it failed.
       - Suggest HOW to fix it.
       - Be concise but educational (like a teaching assistant).
    5. Be strict but reasonable.

    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            compileError: { type: Type.STRING },
            debugInstructions: { type: Type.STRING },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  testCaseId: { type: Type.STRING },
                  passed: { type: Type.BOOLEAN },
                  actualOutput: { type: Type.STRING },
                  error: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CompilationResponse;
    }
    
    throw new Error("No response from AI Model");

  } catch (error: any) {
    console.error("Gemini Simulation Error:", error);
    return {
      success: false,
      compileError: `System Error: ${error.message || "Unknown error occurred"}`,
      results: []
    };
  }
};

export const generateLabManual = async (
  topic: string,
  labType: LabType,
  difficulty: string
): Promise<Partial<LabSession>> => {
  // Existing function for single topic...
  const result = await generateLabsFromContent(topic, labType, difficulty);
  return result[0] || {};
};

export const generateLabsFromContent = async (
  textContext: string,
  labType: LabType,
  difficulty: string,
  fileData?: { mimeType: string, data: string }
): Promise<Partial<LabSession>[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Computer Science Curriculum Designer.
    
    TASK:
    Parse the provided content (text or file) and generate a list of structured Lab Sessions.
    Lab Type: ${labType}
    Difficulty: ${difficulty}
    Additional Context: ${textContext}

    FOR EACH EXPERIMENT IDENTIFIED:
    1. Title: Standard academic title.
    2. Aim: Precise goal of the experiment.
    3. Description: Problem statement details.
    4. Definitions: Extract or define key terms/definitions relevant to this experiment (if any in text, otherwise generate relevant ones).
    5. Procedure: Step-by-step logical implementation guide (array of strings).
    6. LogicHint: Algorithmic hint or pseudo-code snippet.
    7. Files: Provide the FULL WORKING SOLUTION CODE.
       - If 'single-file', name it main.py/c/cpp/java based on likely intent.
       - If 'frontend', provide index.html, styles.css, script.js.
       - If 'database', provide query.sql (solution) and schema.sql (setup).
    8. TestCases: 2 public, 1 private (inputs and expected outputs).

    Return a strict JSON ARRAY of objects matching the schema.
  `;

  const parts: any[] = [];
  
  if (fileData) {
      parts.push({
          inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.data
          }
      });
  }
  
  // Always include text instruction as a part of content
  parts.push({ text: "Generate the lab manual based on the provided context/file." });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            aim: { type: Type.STRING },
            description: { type: Type.STRING },
            definitions: { type: Type.STRING },
            procedure: { type: Type.ARRAY, items: { type: Type.STRING } },
            logicHint: { type: Type.STRING },
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  language: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            },
            testCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  input: { type: Type.STRING },
                  expectedOutput: { type: Type.STRING },
                  isPrivate: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  throw new Error("Failed to generate lab content");
}

export const analyzeSubmission = async (code: string, lab: LabSession): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return "API Key missing";
  
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Review this student submission for the lab: "${lab.title}".
      Aim: ${lab.aim}
      
      Student Code:
      ${code}
      
      Provide a short, constructive feedback paragraph (max 50 words) addressing code quality, efficiency, and logic. Do not reveal the answer directly if it is wrong, but guide them.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    
    return response.text || "No feedback generated.";
}
