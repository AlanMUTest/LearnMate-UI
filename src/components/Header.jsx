//UI/src/components/Header.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';

const loggedInMenu = [
  'Home',
  'Upload',
  'Quiz Game',
  'Flashcards',
  'Account',
  'Logout'
];
const loggedOutMenu = ['Home', 'Login', 'Register'];

const menuPaths = {
  Home: '/',
  Upload: '/upload',
  'Quiz Game': '/quiz-game',
  Flashcards: '/flashcards',
  Login: '/login',
  Register: '/register',
  Account: '/account'
};

const Header = ({ loggedIn, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/');
    setDrawerOpen(false);
  };

  const menuItems = loggedIn ? loggedInMenu : loggedOutMenu;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component="img"
            src="logo.png"
            alt="LearnMate.AI Logo"
            sx={{ height: 90 }}
          />
          <IconButton onClick={handleDrawerToggle} edge="end" aria-label="menu">
            <MenuIcon sx={{ color: '#000' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '80%' : 300,
            backgroundColor: '#000',
            color: '#fff'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box
            component="img"
            src="logo.png"
            alt="LearnMate.AI Logo"
            sx={{ height: 80 }}
          />
        </Box>
        <Divider sx={{ bgcolor: '#555' }} />
        <List>
          {menuItems.map((text, index) => {
            if (text === 'Logout') {
              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={handleLogout} sx={{ "&:hover .MuiListItemText-primary": { color: "yellow" } }}>
                    <ListItemText
                      primary={
                        <span style={{ textDecoration: 'none', color: '#fff', width: '100%', textAlign: 'center' }}>
                          {text}
                        </span>
                      }
                      primaryTypographyProps={{
                        sx: { color: '#fff', textAlign: 'center' }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            } else {
              return (
                <ListItem key={index} disablePadding onClick={handleDrawerToggle}>
                  <ListItemButton sx={{ "&:hover .MuiListItemText-primary": { color: "yellow" } }}>
                    <ListItemText
                      primary={
                        <Link
                          to={menuPaths[text]}
                          style={{
                            textDecoration: 'none',
                            color: '#fff',
                            width: '100%',
                            textAlign: 'center'
                          }}
                        >
                          {text}
                        </Link>
                      }
                      primaryTypographyProps={{
                        sx: { color: '#fff', textAlign: 'center' }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Header;