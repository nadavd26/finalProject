import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

export const ProtectedRoute = ({ component }) => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? (
        React.cloneElement(component, {})
    ) : (
        <Navigate to="/" replace />
    );
};

