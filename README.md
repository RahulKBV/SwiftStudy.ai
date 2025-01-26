# SwiftStudy.ai

**Accelerate your study with ease**

SwiftStudy.ai is an AI-powered learning assistant that delivers concise lessons and interactive quizzes on demand. Designed for students and lifelong learners, the platform provides a seamless and engaging way to master any topic.

---

## Overview

SwiftStudy.ai simplifies learning by breaking down complex topics into digestible lessons, followed by interactive quizzes to reinforce understanding. Powered by the OpenAI API, the app provides fast, reliable, and relevant educational content tailored to the user's input.

---

## How It Works

1. **Input a Topic**: The user enters any topic they want to learn about.
2. **AI-Generated Lesson**: The app generates a structured explanation, including an overview, key details, and practical examples.
3. **Interactive Quiz**: A multiple-choice quiz based on the lesson is generated to test the user's understanding.
4. **User Feedback**: Quiz answers are evaluated in real-time, providing feedback to enhance learning.

---

## Installation

Follow these steps to run the project locally:

### Prerequisites

- Node.js installed on your machine.
- A valid OpenAI API Key.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/RahulKBV/SwiftStudy.ai.git
   cd SwiftStudy.ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add your OpenAI API key:
     ```env
     VITE_OPENAI_API_KEY=your_openai_api_key
     ```
4. Run the application locally:
   ```bash
   npm run dev
   ```
   - Open your browser and navigate to `http://localhost:5173`.

---

## Features

- **On-Demand Learning**: Generate lessons and quizzes for any topic instantly.
- **Interactive Quizzes**: Test your knowledge with multiple-choice quizzes tailored to the generated lesson.
- **Real-Time Feedback**: Receive immediate feedback on your answers.
- **User-Friendly Design**: Clean and modern UI for seamless interaction.

