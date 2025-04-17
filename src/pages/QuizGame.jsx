// UI/src/pages/QuizGame.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  const fetchQuizzes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes.");
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      alert("Error fetching quiz questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to store an incorrect quiz answer into its own DB collection
  const postIncorrectQuiz = async (quizData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/incorrectQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(quizData)
      });
      if (!response.ok) throw new Error("Failed to store incorrect quiz answer");
      const result = await response.json();
      console.log("Stored incorrect quiz:", result);
    } catch (error) {
      console.error("Error storing incorrect quiz:", error);
    }
  };

  // Function to post flashcards (generated from incorrect answers) to the AI flashcard internal endpoint
  const postFlashcardsDirectly = async (payload) => {
    try {
      // For internal calls, use the internal token defined in your .env file.
      // (In production, this call should ideally be done on the server side.)
      const internalToken = "your_internal_token"; // Replace with your actual internal token (or obtain securely)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/flashcard/internal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + internalToken
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Failed to post flashcards");
      }
      const result = await response.json();
      console.log("AI flashcards created:", result);
    } catch (err) {
      console.error("Error posting AI flashcards:", err);
    }
  };

  const handleAnswerClick = (selectedLetter) => {
    const currentQuestion = questions[currentQIndex];
    const optionLetters = ['A', 'B', 'C', 'D'];
    let message = "";

    if (selectedLetter === currentQuestion.correct) {
      message = "Correct!";
    } else {
      // Determine the index of the correct answer.
      const correctIndex = optionLetters.indexOf(currentQuestion.correct);
      const correctString = currentQuestion.options[correctIndex];
      message = `Incorrect! The correct answer was: ${correctString}`;

      const incorrectData = {
        question: currentQuestion.question,
        correctAnswer: correctString,
        quizId: currentQuestion._id,
        userAnswer: selectedLetter
      };

      // Update incorrect answers state and post the incorrect answer
      setIncorrectAnswers(prev => [...prev, incorrectData]);
      postIncorrectQuiz(incorrectData);
    }
    setFeedback(message);

    // Delay to show feedback before moving on
    setTimeout(() => {
      setFeedback("");
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        // End the quiz
        setQuizFinished(true);

        // Post flashcards generated from incorrect answers if available.
        if (incorrectAnswers.length > 0 || selectedLetter !== currentQuestion.correct) {
          // Ensure last question's incorrect answer is included if applicable.
          const optionLetters = ['A', 'B', 'C', 'D'];
          let allIncorrect = [...incorrectAnswers];
          if (selectedLetter !== currentQuestion.correct) {
            const correctIndex = optionLetters.indexOf(currentQuestion.correct);
            const correctString = currentQuestion.options[correctIndex];
            allIncorrect.push({
              question: currentQuestion.question,
              correctAnswer: correctString,
              quizId: currentQuestion._id,
              userAnswer: selectedLetter
            });
          }
          const flashcardPayload = {
            flashcard: allIncorrect.map((item, index) => ({
              Flashcard_Number: index + 1,
              Front_Side: item.question,
              Back_Side: item.correctAnswer,
              topic: null // Optionally add a topic if needed.
            }))
          };
          postFlashcardsDirectly(flashcardPayload);
        }
      }
    }, 1500);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Quizzes are loading... please wait.
        </Typography>
      </Container>
    );
  }

  // If no questions are fetched, display appropriate message.
  if (questions.length === 0 && !quizFinished) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          No quiz questions available.
        </Typography>
      </Container>
    );
  }

  // If quiz has finished, render the Game Over screen.
  if (quizFinished) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: 'green', mb: 4 }}>
            Game Over
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/upload')}
              sx={{ py: 2 }}
            >
              Start Over
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/flashcards')}
              sx={{ py: 2 }}
            >
              Flashcards
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Render the quiz question UI when the quiz is ongoing.
  const currentQuestion = questions[currentQIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Question {currentQIndex + 1} of {questions.length}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {currentQuestion.question}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {currentQuestion.options && currentQuestion.options.map((option, index) => {
              const letter = optionLetters[index] || '';
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleAnswerClick(letter)}
                    sx={{ py: 2 }}
                  >
                    {letter}. {option}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {feedback && (
          <Typography variant="subtitle1" align="center" color="secondary" sx={{ mt: 3 }}>
            {feedback}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default QuizGame;
