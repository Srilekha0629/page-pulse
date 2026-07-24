import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import { analyzeWebsite } from './services/api';
import './styles/App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeWebsite(url);
      if (data.success) {
        setResults(data.report);
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="hero-section">
          <div className="hero-content">
            <div className="hero-icon">
              <span className="rocket">🚀</span>
            </div>
            <h1 className="hero-title">Page Pulse</h1>
            <p className="hero-subtitle">
              Website Performance &amp; SEO Analyzer
            </p>
            <SearchBar
              url={url}
              setUrl={setUrl}
              loading={loading}
              onSubmit={handleAnalyze}
              onClear={handleClear}
            />
          </div>
        </header>

        {error && (
          <div className="error-wrapper">
            <ErrorAlert message={error} onClose={() => setError(null)} />
          </div>
        )}

        {loading && <LoadingSpinner />}

        {results && !loading && !error && (
          <div className="results-section">
            <div className="results-grid">
              <ResultCard
                label="HTTP Status"
                value={results.status}
                icon="status"
                color="blue"
              />
              <ResultCard
                label="Response Time"
                value={results.responseTime}
                icon="time"
                color="purple"
              />
              <ResultCard
                label="Title"
                value={results.title}
                icon="title"
                color="green"
              />
              <ResultCard
                label="Meta Description"
                value={results.metaDescription}
                icon="description"
                color="orange"
              />
              <ResultCard
                label="H1 Tags"
                value={results.h1Count}
                icon="h1"
                color="pink"
              />
              <ResultCard
                label="Images Missing Alt"
                value={results.imagesWithoutAlt}
                icon="image"
                color="red"
              />
              <ResultCard
                label="Word Count"
                value={results.wordCount}
                icon="words"
                color="teal"
              />
            </div>
          </div>
        )}

        {!loading && !results && !error && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">
              Enter a URL above to analyze website performance and SEO metrics
            </p>
          </div>
        )}

        <footer className="app-footer">
          <div className="footer-content">
            <h2 className="footer-title">Page Pulse</h2>
            <p className="footer-subtitle">Website Performance &amp; SEO Analyzer</p>
            <p className="footer-credit">Developed by Srilekha • 2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;