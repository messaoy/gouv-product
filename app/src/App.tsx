import React from 'react';
import './index.css';
import {
  AppBar,
  Breadcrumbs,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import DataTable from "./components/DataTable";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ServiceDetails from "./components/ServiceDetails";

function App() {

  return (
    <Container>
      <AppBar position="fixed" sx={{
          width: '100vw',
          top: '0',
          left: '0',
      }}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
              <Link href="/" id='logo'>
                  Mission Apprentissage
              </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: '1rem', paddingLeft: '1rem', paddingRight: '1rem'}}>
        <Link href="/">
          Accueil
        </Link>
        <Typography color="text.primary">Liste des services</Typography>
      </Breadcrumbs>
      <Container>
          <Router>
              <Routes>
                  <Route path="/" Component={DataTable} />
                  <Route path="/service/:serviceId" Component={ServiceDetails} />
              </Routes>
          </Router>
      </Container>
    </Container>
  );
}

export default App;
