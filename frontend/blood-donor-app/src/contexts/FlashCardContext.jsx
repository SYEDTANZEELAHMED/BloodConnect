import React, { createContext, useContext, useState } from 'react';
import FlashCard from '../components/FlashCard';

const FlashCardContext = createContext();

export const useFlashCard = () => {
  const context = useContext(FlashCardContext);
  if (!context) {
    throw new Error('useFlashCard must be used within a FlashCardProvider');
  }
  return context;
};

export const FlashCardProvider = ({ children }) => {
  const [flashCard, setFlashCard] = useState({
    show: false,
    type: 'success',
    message: '',
    duration: 5000
  });

  const showFlashCard = (type, message, duration = 5000) => {
    setFlashCard({
      show: true,
      type,
      message,
      duration
    });
  };

  const hideFlashCard = () => {
    setFlashCard(prev => ({ ...prev, show: false }));
  };

  const showSuccess = (message, duration) => showFlashCard('success', message, duration);
  const showError = (message, duration) => showFlashCard('error', message, duration);
  const showWarning = (message, duration) => showFlashCard('warning', message, duration);
  const showInfo = (message, duration) => showFlashCard('info', message, duration);

  const value = {
    showFlashCard,
    hideFlashCard,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <FlashCardContext.Provider value={value}>
      {children}
      <FlashCard
        show={flashCard.show}
        type={flashCard.type}
        message={flashCard.message}
        duration={flashCard.duration}
        onClose={hideFlashCard}
      />
    </FlashCardContext.Provider>
  );
};
