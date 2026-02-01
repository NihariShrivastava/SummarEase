import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import VideoSummarizer from './pages/VideoSummarizer';
import TextSummarizer from './pages/TextSummarizer';
import DataToTable from './pages/DataToTable';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';

function App() {
  // Theme state: check local storage or default to 'dark'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    // If saved exists, use it. If not, default to TRUE (Dark Mode).
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`min-vh-100 d-flex flex-column ${darkMode ? 'bg-black text-white' : 'bg-light text-dark'}`}>
        <Navigation darkMode={darkMode} toggleTheme={toggleTheme} />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/get-started" element={<SelectionPage />} />
            <Route path="/video" element={<VideoSummarizer />} />
            <Route path="/text" element={<TextSummarizer />} />
            <Route path="/data" element={<DataToTable />} />
          </Routes>
        </div>
        <footer className={`text-center py-4 mt-auto border-top ${darkMode ? 'border-secondary' : ''}`}>
          <div className="container">
            <p className="mb-0 opacity-50 small">© SummarEase: Summarize with EASE.</p>
            <p className="mb-0 opacity-50 small">~ Nihari Shrivastava</p>
            <p className="mb-0 opacity-50 small">2026</p>

          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
