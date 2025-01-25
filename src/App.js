import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/common/Topbar";
import Sidebar from "./scenes/common/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import Contacts from "./scenes/contacts"
import Team from "./scenes/team"
import Calendar from "./scenes/calendar"
import Geography from "./scenes/geography"
import Form from "./scenes/form"
import Pie from "./scenes/pie"
import Line from "./scenes/line/line"


function App() {
  // Setting up theme and color mode using a custom hook
  const [theme, colorMode] = useMode();  // This hook helps manage the app's theme (light or dark)
  const [isSidebar, setIsSidebar] = useState(true);  // Controls whether the sidebar is visible or not

  // Function to reset everything (clear storage and refresh the page)
  const resetState = () => {
    // Clears everything from the localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Refreshes the page so it starts from the default state
    window.location.reload();
  };

  return (
    // Router is used to navigate between different pages in the app
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        {/* ThemeProvider applies the current theme to the whole app */}
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* This line just makes sure the styles are reset across the app */}
          <div className="app">
            {/* Sidebar is shown or hidden based on isSidebar state */}
            <Sidebar isSidebar={isSidebar} />
            
            {/* Main content area with scrollable layout */}
            <main className="content" style={{ height: "100vh", overflow: "auto" }}>
              {/* Topbar handles the top navigation and has the reset button */}
              <Topbar setIsSidebar={setIsSidebar} resetState={resetState} />
              
              {/* Routes define which component should be displayed based on the URL */}
              <Routes>
                <Route path="/" element={<Dashboard />} />  
                <Route path="/team" element={<Team />} />  
                <Route path="/contacts" element={<Contacts />} />  
                <Route path="/form" element={<Form />} />  
                <Route path="/pie" element={<Pie />} />  
                <Route path="/line" element={<Line />} />  
                <Route path="/geography" element={<Geography />} />  
                <Route path="/calendar" element={<Calendar />} />  
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  );
}

export default App;
