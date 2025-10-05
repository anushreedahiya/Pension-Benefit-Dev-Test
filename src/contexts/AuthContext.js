'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }

      // Save user data to MongoDB
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userCredential.user.uid,
            userData: {
              email: userCredential.user.email,
              displayName: displayName || userCredential.user.displayName,
              firstName: displayName ? displayName.split(' ')[0] : '',
              lastName: displayName ? displayName.split(' ').slice(1).join(' ') : '',
              createdAt: new Date(),
              lastLoginAt: new Date()
            }
          })
        });

        if (!response.ok) {
          console.warn('Failed to save user data to MongoDB');
        }
      } catch (dbError) {
        console.warn('Error saving user data to MongoDB:', dbError);
      }

      // Send signup email notification
      try {
        await fetch('/api/email/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            userName: displayName || email
          })
        });
      } catch (emailError) {
        console.warn('Error sending signup email:', emailError);
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Send signin email notification
      try {
        await fetch('/api/email/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            userName: userCredential.user.displayName || email
          })
        });
      } catch (emailError) {
        console.warn('Error sending signin email:', emailError);
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Save user data to MongoDB
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: result.user.uid,
            userData: {
              email: result.user.email,
              displayName: result.user.displayName,
              firstName: result.user.displayName ? result.user.displayName.split(' ')[0] : '',
              lastName: result.user.displayName ? result.user.displayName.split(' ').slice(1).join(' ') : '',
              photoURL: result.user.photoURL,
              lastLoginAt: new Date()
            }
          })
        });

        if (!response.ok) {
          console.warn('Failed to save user data to MongoDB');
        }
      } catch (dbError) {
        console.warn('Error saving user data to MongoDB:', dbError);
      }

      // Send signin email notification for Google signin
      try {
        await fetch('/api/email/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: result.user.email,
            userName: result.user.displayName || result.user.email
          })
        });
      } catch (emailError) {
        console.warn('Error sending signin email:', emailError);
      }
      
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const signout = async () => {
    try {
      // Get user info before signing out
      const currentUser = auth.currentUser;
      const userEmail = currentUser?.email;
      const userName = currentUser?.displayName;
      
      await signOut(auth);
      
      // Send signout email notification
      if (userEmail) {
        try {
          await fetch('/api/email/signout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail,
              userName: userName || userEmail
            })
          });
        } catch (emailError) {
          console.warn('Error sending signout email:', emailError);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    signup,
    signin,
    signInWithGoogle,
    signout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 