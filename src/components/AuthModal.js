'use client';

import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  const handleSwitchToSignUp = () => {
    setMode('signup');
  };

  const handleSwitchToSignIn = () => {
    setMode('signin');
  };

  const handleClose = () => {
    setMode(initialMode); // Reset to initial mode when closing
    onClose();
  };

  return (
    <>
      {mode === 'signin' ? (
        <SignIn 
          onClose={handleClose} 
          onSwitchToSignUp={handleSwitchToSignUp} 
        />
      ) : (
        <SignUp 
          onClose={handleClose} 
          onSwitchToSignIn={handleSwitchToSignIn} 
        />
      )}
    </>
  );
} 