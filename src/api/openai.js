import axios from "axios";

// Load the OpenAI API key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Ensure the API key is present
if (!apiKey) {
  console.error("OpenAI API Key is missing. Please set VITE_OPENAI_API_KEY in your .env file.");
}

// Set Axios default headers
axios.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;

/**
 * Fetch a detailed lesson based on the provided topic.
 */
export const getLesson = async (topic) => {
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a tutor who explains topics in a structured and visually appealing format.",
        },
        {
            role: "user",
            content: `Generate a concise, structured explanation of the topic: "${topic}". Use the following format:
            1. Overview (in 50 words): Summarize the topic in plain text.
            2. Key Details (with no bold letters): Highlight the most important points, with each detail explained in no more than 100 words.
            3. Examples/Applications (with no bold letters): Provide relevant examples or applications, keeping each example concise and impactful.
            Ensure the response is detailed yet concise. Avoid long paragraphs, and keep the entire response under 400 words.`
          }
      ],
      max_tokens: 500,
    });

    return response.data.choices[0]?.message?.content || "Failed to fetch the lesson.";
  } catch (error) {
    console.error("Error generating lesson:", error.response?.data || error.message);
    return "Failed to generate the lesson.";
  }
};

/**
 * Fetch a multiple-choice quiz based on the provided topic.
 */
export const getQuiz = async (topic) => {
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a tutor who creates simple quizzes based on your lessons.",
          },
          {
            role: "user",
            content: `Generate a multiple-choice quiz on "${topic}" with exactly 5 questions. 
          Each question must have 4 options labeled "A. ", "B. ", "C. ", "D. ".
          After the questions, add a single line that begins with "Answers:" 
          followed by the 5 correct letters, separated by commas. For example:
          Answers: A, D, C, B, A
          No additional explanation or text.`
          }
          
        ],
        max_tokens: 500,
      });
  
      return response.data.choices[0]?.message?.content || "Failed to fetch the quiz.";
    } catch (error) {
      console.error("Error generating quiz:", error.response?.data || error.message);
      return "Failed to generate the quiz.";
    }
  };  
  
/**
 * Fetch subtle hints for each quiz question based on the lesson.
 */
export const getHints = async (topic) => {
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a tutor who provides hints for quizzes based on lessons.",
        },
        {
          role: "user",
          content: `For each quiz question derived from the explanation of "${topic}", generate a subtle hint based on the explanation content. The hint should be concise and not directly reveal the answer.`,
        },
      ],
      max_tokens: 300,
    });

    // Split hints into an array, filtering out any empty lines
    return response.data.choices[0]?.message?.content.split("\n").filter(Boolean) || [];
  } catch (error) {
    console.error("Error generating hints:", error.response?.data || error.message);
    return [];
  }
};
