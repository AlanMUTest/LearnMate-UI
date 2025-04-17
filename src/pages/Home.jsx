//UI/src/pages/Home.jsx
import React from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';

const Home = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Container maxWidth="lg" sx={{ my: 4, mb: 10 }}>
      {/* Big card container with background image */}
      <Box
        sx={{
          borderRadius: 10, // increased roundness
          overflow: 'hidden',
          height: isMobile ? 300 : 700,
          position: 'relative',
          backgroundImage: 'url(homeimg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography
            variant={isMobile ? 'h3' : 'h2'} // larger title
            sx={{ color: '#fff', fontWeight: 'bold', mb: 8 }} // more space below the title
          >
            Start Your Own LearnMate AI
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', mb: 4 }}>
            One, Upload Notes.
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', mb: 4 }}>
            Two, Game Play.
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', mb: 4 }}>
            Three, Enjoy Flashcards.
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff' }}>
            Finally, Have Fun.
          </Typography>
        </Box>
      </Box>

      {/* Text Containers (displayed left-to-right now, larger, and with more spacing) */}
      <Box sx={{ mt: 15, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 1st text container */}
        <Box>
          <Typography variant="h4" sx={{ color: '#000', mb: 3 }}>
            What is LearnMate AI?
          </Typography>
          <Typography variant="h6" sx={{ color: 'green' }}>
            LearnMate is{' '}
            <span style={{ fontWeight: 'bold' }}>
              your personalized AI-powered study companion
            </span>{' '}
            that analyzes your uploaded notes, creates tailored quizzes and flashcards, and explains the questions you answered incorrectly to improve your learning performance.
          </Typography>
        </Box>

        {/* 2nd text container */}
        <Box>
          <Typography variant="h4" sx={{ color: '#000', mb: 3 }}>
            How do I get started?
          </Typography>
          <Typography variant="h6" sx={{ color: 'green' }}>
            Simply sign up, then{' '}
            <span style={{ fontWeight: 'bold' }}>
              upload your study notes
            </span>{' '}
            on the Upload Page. You can also choose how many quizzes you want our AI made in each quiz attempt.
          </Typography>
        </Box>

        {/* 3rd text container */}
        <Box>
          <Typography variant="h4" sx={{ color: '#000', mb: 3 }}>
            How does the quiz game work?
          </Typography>
          <Typography variant="h6" sx={{ color: 'green' }}>
            Once your notes are analyzed, LearnMate{' '}
            <span style={{ fontWeight: 'bold' }}>
              generates multiple choice quizzes based on the content
            </span>
            . These quizzes help you deepen your learning and pinpoint areas for improvement.
          </Typography>
        </Box>

        {/* 4th text container */}
        <Box>
          <Typography variant="h4" sx={{ color: '#000', mb: 3 }}>
            What are the flashcards for?
          </Typography>
          <Typography variant="h6" sx={{ color: 'green' }}>
            Flashcards are created automatically from your quiz results to{' '}
            <span style={{ fontWeight: 'bold' }}>
              highlight where you made mistakes
            </span>
            . You can review these flashcards to reinforce your memory, or even create your own.
          </Typography>
        </Box>

        {/* 5th text container */}
        <Box>
          <Typography variant="h4" sx={{ color: '#000', mb: 3 }}>
            Is my data secure?
          </Typography>
          <Typography variant="h6" sx={{ color: 'green' }}>
            Absolutely.{' '}
            <span style={{ fontWeight: 'bold' }}>
              We take your privacy seriously
            </span>
            . Your uploaded notes and performance data are stored securely and are used only to enhance your learning experience.
          </Typography>
        </Box>
      </Box>

      {/* Additional bottom spacing */}
      <Box sx={{ height: 120 }} />
    </Container>
  );
};

export default Home;
