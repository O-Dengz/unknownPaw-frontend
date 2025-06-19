import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FloatingButton.css';

interface FloatingButtonProps {
  icon?: string;
  onClick?: () => void;
  to?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ 
  icon = 'edit',
  onClick,
  to = '/postad' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  if (
    path.startsWith('/communitypost') ||
    path.startsWith('/petownerpost') ||
    path.startsWith('/petsitterpost') ||
    path.startsWith('/login') ||
    path.startsWith('/join') ||
    path.startsWith('/postAd')
  ) {
    return null;
  }

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button 
      className="floating-button"
      onClick={handleClick}
      aria-label="글쓰기"
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};

export default FloatingButton; 