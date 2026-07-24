import React, { useEffect, useState } from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';
import './ErrorAlert.css';

const ErrorAlert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`error-alert ${isVisible ? 'error-alert-visible' : 'error-alert-hidden'}`}
      role="alert"
      aria-live="polite"
    >
      <div className="error-content">
        <FaExclamationCircle className="error-icon" aria-hidden="true" />
        <span className="error-message">{message}</span>
      </div>
      <button 
        className="error-close" 
        onClick={handleClose} 
        aria-label="Close error notification"
        type="button"
      >
        <FaTimes aria-hidden="true" />
      </button>
    </div>
  );
};

export default ErrorAlert;