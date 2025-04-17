//UI/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Raleway", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Nunito", "Raleway", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Nunito", "Raleway", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Nunito", "Raleway", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Nunito", "Raleway", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Raleway", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Raleway", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Raleway", sans-serif',
    },
    body2: {
      fontFamily: '"Raleway", sans-serif',
    },
  },
});

export default theme;
