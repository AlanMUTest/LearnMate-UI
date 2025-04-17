// UI/src/pages/Flashcards.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

// ---- Styled Components ----
const HeaderTabs = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '20px',
  borderBottom: '2px solid #ccc'
});

const TabButton = styled(Button)(({ active }) => ({
  fontWeight: active ? 'bold' : 'normal',
  color: active ? 'green' : '#555',
  borderBottom: active ? '2px solid green' : 'none'
}));

// Updated Card styling: Reduced size
const CardStyle = {
  width: '290px',     // reduced width
  minHeight: '400px',  // reduced height
  border: '1px solid #aaa',
  borderRadius: '4px',
  padding: '15px',
  background: '#fff',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden'
};

// Flip button styling remains similar
const flipBtnStyle = {
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 12px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

// Text style for labels (black, bold) and content (green, normal, larger)
const labelStyle = { color: 'black', fontWeight: 'bold', fontSize: '20px' };
const contentStyle = { color: 'green', fontWeight: 'normal', fontSize: '20px' };

// ---- Flashcard Card Component (used for both AI and User) ----
const FlashcardCard = ({ flashcard, onEdit, onDelete }) => {
  const [flipped, setFlipped] = useState(false);
  // Toggle the flip state without propagating the click to open edit popup.
  const handleFlipClick = (e) => {
    e.stopPropagation();
    setFlipped((prev) => !prev);
  };

  return (
    <Paper
      sx={{ ...CardStyle, padding: '15px' }}
      onClick={() => onEdit(flashcard)}
    >
      {!flipped ? (
        // Front View: Display Topic (if available) and Question.
        <Box>
          {flashcard.type === "User" && (
            <Typography variant="h6">
              <span style={labelStyle}>Topic:</span>{' '}
              <span style={contentStyle}>{flashcard.topic || 'N/A'}</span>
            </Typography>
          )}
          <Typography variant="body1" sx={{ mt: flashcard.type === "User" ? 1 : 0 }}>
            <span style={labelStyle}>Question:</span><br />
            <span style={contentStyle}>{flashcard.question}</span>
          </Typography>
          <Box sx={{ position: 'absolute', bottom: 15, right: 15 }}>
            <Button onClick={handleFlipClick} sx={flipBtnStyle}>
              Flip To Answer
            </Button>
          </Box>
        </Box>
      ) : (
        // Back View: Display Answer only.
        <Box>
          <Typography variant="body1">
            <span style={labelStyle}>Answer:</span><br />
            <span style={contentStyle}>{flashcard.answer}</span>
          </Typography>
          <Box sx={{ position: 'absolute', bottom: 15, left: 15 }}>
            <Button onClick={handleFlipClick} sx={flipBtnStyle}>
              Flip Back
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// ---- Main Flashcards Component ----
const Flashcards = () => {
  const [activeTab, setActiveTab] = useState('ai'); // "ai" or "user"
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL; // e.g., http://localhost:3101
  const token = localStorage.getItem("token") || "";

  // Delete confirmation dialog state.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);

  // Edit / Create dialog state (only applicable for user flashcards).
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [userForm, setUserForm] = useState({
    topic: '',
    question: '',
    answer: ''
  });

  // Fetch flashcards for the authenticated user.
  const loadFlashcards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/flashcard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      if (!response.ok) throw new Error("Failed to fetch flashcards");
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error loading flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  const displayedFlashcards = flashcards.filter(fc =>
    activeTab === 'ai' ? fc.type === "AI" : fc.type === "User"
  );

  // ---- Handlers ----

  // Delete Handlers
  const handleDelete = (flashcard) => {
    setFlashcardToDelete(flashcard);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (flashcardToDelete) {
      try {
        const response = await fetch(`${baseUrl}/api/flashcard/${flashcardToDelete._id}`, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token
          }
        });
        if (!response.ok) throw new Error("Failed to delete flashcard");
        setFlashcards(prev =>
          prev.filter(fc => fc._id !== flashcardToDelete._id)
        );
        // CLOSE edit dialog as well as the confirm dialog
        closeUserDialog();
      } catch (error) {
        console.error("Error deleting flashcard:", error);
      }
    }
    setConfirmOpen(false);
    setConfirmOpen(false);
    setFlashcardToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setFlashcardToDelete(null);
  };

  // Edit Dialog: For user flashcards (open when clicking on a card).
  // (You may decide to allow AI flashcards to be edited too.)
  const openUserDialogForEdit = (flashcard) => {
    setEditingFlashcard(flashcard);
    setUserForm({
      topic: flashcard.topic || '',
      question: flashcard.question,
      answer: flashcard.answer
    });
    setUserDialogOpen(true);
  };

  // Create New Flashcard Dialog.
  const openUserDialogForNew = () => {
    setEditingFlashcard(null);
    setUserForm({ topic: '', question: '', answer: '' });
    setUserDialogOpen(true);
  };

  const closeUserDialog = () => {
    setUserDialogOpen(false);
    setEditingFlashcard(null);
    setUserForm({ topic: '', question: '', answer: '' });
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  // Save (create or update) user flashcard.
  const saveUserFlashcard = async () => {
    if (!userForm.question || !userForm.answer) {
      alert("Question and Answer are required.");
      return;
    }
    try {
      const flashcardData = { ...userForm, type: "User" };
      if (editingFlashcard) {
        // Update flashcard.
        const response = await fetch(`${baseUrl}/api/flashcard/${editingFlashcard._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify(flashcardData)
        });
        if (!response.ok) throw new Error("Update failed");
        const updated = await response.json();
        setFlashcards(prev =>
          prev.map(fc => (fc._id === editingFlashcard._id ? updated.flashcard : fc))
        );
      } else {
        // Create new flashcard.
        const response = await fetch(`${baseUrl}/api/flashcard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify(flashcardData)
        });
        if (!response.ok) throw new Error("Create failed");
        const created = await response.json();
        setFlashcards(prev => [...prev, created.flashcard]);
      }
      closeUserDialog();
    } catch (error) {
      console.error("Error saving flashcard:", error);
      alert("Error saving flashcard.");
    }
  };

  // ---- Render Helpers ----
  const renderFlashcardsGrid = (cards) => (
    <Grid container spacing={3}>
      {cards.map(card => (
        <Grid item key={card._id}>
          <FlashcardCard
            flashcard={card}
            onEdit={openUserDialogForEdit}
            onDelete={handleDelete}
          />
        </Grid>
      ))}
    </Grid>
  );

  // ---- UI Render ----
  return (
    <Container sx={{ mt: 4 }}>
      {/* Header Tabs */}
      <HeaderTabs>
        <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          AI Made Flashcards
        </TabButton>
        <TabButton active={activeTab === 'user'} onClick={() => setActiveTab('user')}>
          User Made Flashcards
        </TabButton>
      </HeaderTabs>

      {/* Main Content */}
      {activeTab === 'ai' ? (
        <Box>
          <Typography variant="h4" align="center">AI Made Flashcards</Typography>
          {loading ? (
            <Typography variant="h6" align="center" sx={{ mt: 3 }}>
              Loading Flashcards...
            </Typography>
          ) : (
            <Box sx={{ mt: 3 }}>
              {displayedFlashcards.length > 0 ? (
                renderFlashcardsGrid(displayedFlashcards)
              ) : (
                <Typography align="center">No AI flashcards available.</Typography>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" align="center">User Made Flashcards</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={openUserDialogForNew}>
              Add a Flashcard!
            </Button>
          </Box>
          {loading ? (
            <Typography variant="h6" align="center" sx={{ mt: 3 }}>
              Loading Flashcards...
            </Typography>
          ) : (
            <Box sx={{ mt: 3 }}>
              {displayedFlashcards.length > 0 ? (
                renderFlashcardsGrid(displayedFlashcards)
              ) : (
                <Typography align="center">No user flashcards available.</Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={cancelDelete} fullWidth maxWidth="xs">
        <DialogTitle>Delete Flashcard?</DialogTitle>
        <DialogContent>
          <Typography align="center">
            Are you sure you want to delete this flashcard?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} sx={{ width: '100%', p: 2 }} justifyContent="space-between">
            <Grid item xs={5}>
              <Button
                onClick={confirmDelete}
                variant="contained"
                color="error" 
                fullWidth
                sx={{ minHeight: '40px' }}
                >Delete
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button onClick={cancelDelete} variant="contained" fullWidth sx={{ minHeight: '40px' }}>
                No
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      {/* Edit/Create Flashcard Dialog (for User Cards) */}
      <Dialog open={userDialogOpen} onClose={closeUserDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingFlashcard ? "Edit Flashcard" : "Add a Flashcard"}
          <IconButton onClick={closeUserDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Topic"
            name="topic"
            fullWidth
            value={userForm.topic}
            onChange={handleUserFormChange}
            InputLabelProps={{ style: { color: 'black', fontWeight: 'bold' } }}
            InputProps={{ style: { color: 'green', fontWeight: 'normal', fontSize: '18px' } }}
          />
          <TextField
            margin="dense"
            label="Question"
            name="question"
            multiline
            rows={4}
            fullWidth
            value={userForm.question}
            onChange={handleUserFormChange}
            InputLabelProps={{ style: { color: 'black', fontWeight: 'bold' } }}
            InputProps={{ style: { color: 'green', fontWeight: 'normal', fontSize: '18px' } }}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Answer"
            name="answer"
            multiline
            rows={4}
            fullWidth
            value={userForm.answer}
            onChange={handleUserFormChange}
            InputLabelProps={{ style: { color: 'black', fontWeight: 'bold' } }}
            InputProps={{ style: { color: 'green', fontWeight: 'normal', fontSize: '18px' } }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} sx={{ width: '100%', p: 2 }} justifyContent="space-between">
            <Grid item xs={5}>
              {editingFlashcard && (
                <Button onClick={() => handleDelete(editingFlashcard)} variant="contained" color="error" fullWidth sx={{ minHeight: '40px' }}>
                  Delete
                </Button>
              )}
            </Grid>
            <Grid item xs={5}>
              <Button onClick={saveUserFlashcard} variant="contained" fullWidth sx={{ minHeight: '40px' }}>
                Update
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flashcards;
