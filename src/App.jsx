import { useState } from "react";
import { getLesson, getQuiz } from "./api/openai";
import "./App.css"; // If you have global styles you want to apply

function App() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answersFeedback, setAnswersFeedback] = useState({});

  // Generate lesson & quiz
  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }
    setLoading(true);
    setLesson("");
    setQuiz([]);
    setAnswersFeedback({});

    try {
      const rawLesson = await getLesson(topic);
      setLesson(formatLesson(rawLesson));

      const rawQuiz = await getQuiz(topic);
      const formattedQuiz = formatQuiz(rawQuiz);
      setQuiz(formattedQuiz);
    } catch (err) {
      console.error("Error generating content:", err);
      alert("Something went wrong. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Convert raw lesson into HTML
  const formatLesson = (rawLesson) => {
    let formatted = rawLesson
      .replace(/###/g, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\\n/g, "<br/>");
  
    formatted = "<p>" + formatted;
  
    formatted = formatted
      .replace(/1\. Overview:/i, "</p><p><strong>1. Overview:</strong>")
      .replace(/2\. Key Details:/i, "</p><p><strong>2. Key Details:</strong>")
      .replace(/3\. Examples.*:/i, "</p><p><strong>3. Examples/Applications:</strong>");
  
    formatted += "</p>";
  
    return formatted;
  };
  
  
  

  // Parse quiz text into objects
  const formatQuiz = (rawQuiz) => {
    const lines = rawQuiz.split("\n");
    const questions = [];
    let currentQuestion = null;
    let answersLine = "";

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (/^\d+\./.test(trimmed)) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = { question: trimmed, options: [], correctAnswer: "" };
      } else if (/^[A-D]\./.test(trimmed) && currentQuestion) {
        currentQuestion.options.push(trimmed);
      } else if (/^Answers:/i.test(trimmed)) {
        answersLine = trimmed;
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    if (answersLine) {
      const correctAnswers = answersLine
        .replace(/^Answers:/i, "")
        .split(",")
        .map((ans) => ans.trim());
      correctAnswers.forEach((ans, i) => {
        if (questions[i]) {
          questions[i].correctAnswer = ans;
        }
      });
    }
    return questions;
  };

  // Handle user’s selected answer
  const handleAnswer = (qIndex, letter) => {
    const correctAnswer = quiz[qIndex].correctAnswer;
    const isCorrect = letter === correctAnswer;

    setAnswersFeedback((prev) => ({
      ...prev,
      [qIndex]: isCorrect
        ? { message: "Correct! 🎉", isCorrect: true }
        : {
            message: `❌ Wrong! The correct answer is: ${correctAnswer}`,
            isCorrect: false,
          },
    }));
  };

  return (
    <div style={styles.pageWrapper}>
      
      <h1 style={styles.title}>SwiftStudy.ai</h1>
      <p style={styles.slogan}>Accelerate your study with ease</p>
  
      <p style={styles.subtitle}>Enter a topic below to generate a lesson and quiz!</p>
  
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="e.g. Machine Learning, Stocks..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Generating..." : "Teach me this!"}
        </button>
      </div>
  

      {/* Lesson */}
      {lesson && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Quick Lesson:</h2>
          <div
            style={styles.cardContent}
            dangerouslySetInnerHTML={{ __html: lesson }}
          />
        </div>
      )}

      {/* Quiz */}
      {quiz.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Quiz Time!</h2>
          {quiz.map((q, qIndex) => {
            const userFeedback = answersFeedback[qIndex];
            const userAnswered = !!userFeedback;

            return (
              <div key={qIndex} style={styles.quizItem}>
                <p style={styles.questionText}>{q.question}</p>
                <div style={styles.optionsGrid}>
                  {q.options.map((option, optIndex) => {
                    const optionLetter = option.split(".")[0].trim();
                    let bgColor = "#eee";

                    if (userAnswered) {
                      // highlight answers
                      const isCorrectOption =
                        userFeedback.isCorrect && q.correctAnswer === optionLetter;
                      bgColor = isCorrectOption ? "#cffbd6" : "#ffd3d3";
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(qIndex, optionLetter)}
                        disabled={userAnswered}
                        style={{
                          ...styles.optionButton,
                          backgroundColor: bgColor,
                          cursor: userAnswered ? "not-allowed" : "pointer",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {userFeedback && (
                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: 600,
                      color: userFeedback.isCorrect ? "#0f5132" : "#842029",
                    }}
                  >
                    {userFeedback.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Inline styles for a vibrant, fun look */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    margin: 0,
    padding: "20px",
    // Fun background gradient
    background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
    fontFamily: "'Poppins', sans-serif", // Make sure you have this loaded in index.html
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    margin: "10px 0",
    color: "#ff4081",
    textShadow: "1px 2px 2px rgba(0,0,0,0.2)",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    color: "#333",
  },
  inputContainer: {
    display: "inline-flex",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ff4081",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  card: {
    margin: "0 auto 30px auto",
    maxWidth: "800px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
    boxShadow: "0px 4px 14px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
    color: "#ff4081",
    borderBottom: "2px solid #ff4081",
    paddingBottom: "5px",
  },
  cardContent: {
    lineHeight: "1.6",
    fontSize: "1rem",
    color: "#333",
  },
  quizItem: {
    marginBottom: "20px",
  },
  questionText: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#333",
    marginBottom: "8px",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  optionButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#333",
    // fun hover effect:
    transition: "transform 0.2s ease",
  },
};

export default App;
