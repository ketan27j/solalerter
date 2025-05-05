// import React from 'react';
// import { Navigate } from 'react-router-dom';

// interface ProtectedRouteProps {
//   children?: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const token = localStorage.getItem('authToken');
//   console.log('ProtectedRoute - Token:', token);
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   if(children) {
//     return children;
//   }
//   else {
//     <Navigate to="/login" replace />;
//   }
   
  
// };

// export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';
// import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if auth_token exists in localStorage
  const token = localStorage.getItem('authToken');
  
  // If no token is found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If children are provided, render them
  // Otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;