import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './routes/route';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/sb-admin-2.min.css';
import './assets/vendor/fontawesome-free/css/all.min.css'

import './assets/vendor/jquery/jquery.min.js'
import './assets/vendor/bootstrap/js/bootstrap.bundle.min.js'
import './assets/vendor/jquery-easing/jquery.easing.min.js'




const theme = createTheme({
  palette: {
    primary: {
      main: '#0f1f40',
    },
  },
});
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <RoutesConfig />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
