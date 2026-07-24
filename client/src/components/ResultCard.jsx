import React from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaHeading,
  FaFileAlt,
  FaHashtag,
  FaImage,
  FaAlignLeft,
  FaGlobe
} from 'react-icons/fa';
import './ResultCard.css';

const ResultCard = ({ label, value, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'status':
        return <FaCheckCircle />;
      case 'time':
        return <FaClock />;
      case 'title':
        return <FaGlobe />;
      case 'description':
        return <FaFileAlt />;
      case 'h1':
        return <FaHeading />;
      case 'image':
        return <FaImage />;
      case 'words':
        return <FaAlignLeft />;
      default:
        return <FaHashtag />;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'card-blue';
      case 'purple':
        return 'card-purple';
      case 'green':
        return 'card-green';
      case 'orange':
        return 'card-orange';
      case 'pink':
        return 'card-pink';
      case 'red':
        return 'card-red';
      case 'teal':
        return 'card-teal';
      default:
        return 'card-blue';
    }
  };

  const getStatusColor = () => {
    if (label === 'HTTP Status') {
      if (value >= 200 && value < 300) return '#10b981';
      if (value >= 300 && value < 400) return '#f59e0b';
      return '#ef4444';
    }
    return undefined;
  };

  const getDisplayValue = () => {
    if (value === undefined || value === null) return 'N/A';
    
    // For Title and Meta Description, truncate if too long
    if (label === 'Title' || label === 'Meta Description') {
      const strValue = String(value);
      // Truncate at 100 characters for safety, CSS will handle the 2-line truncation
      return strValue;
    }
    
    return value;
  };

  // Check if this is a text-heavy field that needs truncation
  const isTextField = label === 'Title' || label === 'Meta Description';

  return (
    <div className={`result-card ${getColorClass()}`}>
      <div className="card-icon-wrapper">
        <span className="card-icon">{getIcon()}</span>
      </div>
      <div className="card-content">
        <p className="card-label">{label}</p>
        <p 
          className={`card-value ${isTextField ? 'card-value-text' : ''}`}
          style={{ color: getStatusColor() }}
        >
          {getDisplayValue()}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;