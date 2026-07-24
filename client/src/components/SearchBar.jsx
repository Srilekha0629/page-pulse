import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ url, setUrl, loading, onSubmit, onClear }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleClear = () => {
    setUrl('');
    onClear();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="url"
          className="search-input"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          autoFocus
        />
        {url && !loading && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear URL"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="analyze-button"
        disabled={loading || !url.trim()}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export default SearchBar;