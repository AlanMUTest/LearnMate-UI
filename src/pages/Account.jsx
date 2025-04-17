import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper
} from '@mui/material'
import { styled } from '@mui/system'

const HeaderTabs = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '20px',
  borderBottom: '2px solid #ccc'
})

const TabButton = styled(Button)(({ active }) => ({
  fontWeight: active ? 'bold' : 'normal',
  color: active ? 'green' : '#555',
  borderBottom: active ? '2px solid green' : 'none'
}))

const SectionPaper = styled(Paper)({
  padding: '20px',
  maxWidth: 600,
  margin: '0 auto'
})

const Account = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const token   = localStorage.getItem('token') || ''

  const [activeTab, setActiveTab] = useState('profile')

  // --- Profile Settings state ---
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [profileMsg, setProfileMsg] = useState('')

  // --- Change Password state ---
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg,     setPwdMsg]     = useState('')

  // --- Delete Account state ---
  const [delMsg, setDelMsg] = useState('')

  // Fetch user on mount
  useEffect(() => {
    if (!token) return window.location.href = '/login'
    fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(user => {
        setUsername(user.username)
        setEmail(user.email)
      })
      .catch(() => setProfileMsg('Failed to load profile'))
  }, [baseUrl, token])

  // HANDLERS

  const handleProfileUpdate = async () => {
    const res = await fetch(`${baseUrl}/api/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, email })
    })
    const data = await res.json()
    setProfileMsg(data.msg || 'Update failed')
  }

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      setPwdMsg('New passwords do not match')
      return
    }
    const res = await fetch(`${baseUrl}/api/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd })
    })
    const data = await res.json()
    setPwdMsg(data.msg || 'Change password failed')
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return
    const res = await fetch(`${baseUrl}/api/auth/delete`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else {
      setDelMsg('Delete failed')
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <HeaderTabs>
        <TabButton active={activeTab==='profile'} onClick={()=>setActiveTab('profile')}>
          Profile Settings
        </TabButton>
        <TabButton active={activeTab==='password'} onClick={()=>setActiveTab('password')}>
          Change Password
        </TabButton>
        <TabButton active={activeTab==='delete'} onClick={()=>setActiveTab('delete')}>
          Delete Account
        </TabButton>
      </HeaderTabs>

      {activeTab === 'profile' && (
        <SectionPaper elevation={3}>
          <Typography variant="h5" gutterBottom>Profile Settings</Typography>
          <Typography color="error" sx={{ mb: 2 }}>{profileMsg}</Typography>
          <TextField
            fullWidth label="Username" margin="normal"
            value={username} onChange={e=>setUsername(e.target.value)}
          />
          <TextField
            fullWidth label="Email" margin="normal" type="email"
            value={email} onChange={e=>setEmail(e.target.value)}
          />
          <Box textAlign="center" mt={2}>
            <Button variant="contained" onClick={handleProfileUpdate}>
              Update Profile
            </Button>
          </Box>
        </SectionPaper>
      )}

      {activeTab === 'password' && (
        <SectionPaper elevation={3}>
          <Typography variant="h5" gutterBottom>Change Password</Typography>
          <Typography color="error" sx={{ mb: 2 }}>{pwdMsg}</Typography>
          <TextField
            fullWidth label="Current Password" margin="normal" type="password"
            value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)}
          />
          <TextField
            fullWidth label="New Password" margin="normal" type="password"
            value={newPwd} onChange={e=>setNewPwd(e.target.value)}
          />
          <TextField
            fullWidth label="Confirm New Password" margin="normal" type="password"
            value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)}
          />
          <Box textAlign="center" mt={2}>
            <Button variant="contained" onClick={handleChangePassword}>
              Change Password
            </Button>
          </Box>
        </SectionPaper>
      )}

      {activeTab === 'delete' && (
        <SectionPaper elevation={3}>
          <Typography variant="h5" gutterBottom>Delete Account</Typography>
          <Typography color="error" sx={{ mb: 2 }}>{delMsg}</Typography>
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </Button>
          </Box>
        </SectionPaper>
      )}
    </Container>
  )
}

export default Account
