import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './Context/UserContext'

export const ProtectedRoute = ({ component }) => {
    const { user, setUser } = useContext(UserContext); // Destructure the login function from useAuth

    return user ? (
        React.cloneElement(component, {})
    ) : (
        <Navigate to="/" replace />
    );
};

