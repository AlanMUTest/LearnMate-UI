//UI/src/pages/Upload.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const BackgroundBox = styled(Box)({
  minHeight: '100vh',
  backgroundImage: 'url(/Uploadbg.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  paddingTop: '80px'
});

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quizCount, setQuizCount] = useState('');
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : '');
  };

  // Handle quiz count selection
  const handleQuizCountChange = (e) => {
    setQuizCount(e.target.value);
  };

  // Handle the upload process
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please upload your notes file.");
      return;
    }
    if (!quizCount) {
      alert("Please select the number of quizzes you want.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("quizCount", quizCount);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: "POST",
        headers: { 
          "Authorization": "Bearer " + token
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Optionally you can parse response and show a success message if needed.
      await response.json();

      // After the backend has finished processing, redirect to the QuizGame page.
      navigate("/quiz-game");
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Error during upload. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <BackgroundBox>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" align="center" sx={{ color: 'green', mb: 25 }}>
          Upload Your Notes
        </Typography>
        <Paper elevation={3} sx={{ p: 3, maxWidth: '600px', mx: 'auto', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Button 
              variant="contained" 
              component="label"
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'green',
                color: '#fff',
                fontSize: '3rem',
                flexShrink: 0
              }}
              title="Upload your notes"
            >
              +
              <input type="file" hidden onChange={handleFileChange} accept=".pdf, .txt, .docx" />
            </Button>
            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel id="quiz-count-label"># Quizzes</InputLabel>
              <Select
                labelId="quiz-count-label"
                value={quizCount}
                label="# Quizzes"
                onChange={handleQuizCountChange}
              >
                <MenuItem value="" disabled>
                  Select number of quizzes
                </MenuItem>
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1} Quiz{i + 1 > 1 ? 'zes' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {fileName && (
            <Typography variant="body1" sx={{ color: 'green', mb: 2, textAlign: 'center' }}>
              Selected file: {fileName}
            </Typography>
          )}
          <Button variant="contained" color="primary" fullWidth onClick={handleUpload} disabled={processing}>
            {processing ? "Processing..." : "Send"}
          </Button>
        </Paper>
      </Container>
    </BackgroundBox>
  );
};

export default Upload;
