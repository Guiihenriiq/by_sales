import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { testWishlistAPI } from '../utils/apiTest';

const AuthDebug: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Auth Debug:</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Token: {token ? '✅ Present' : '❌ Missing'}</div>
      <div>User: {user ? `✅ ${user.name}` : '❌ None'}</div>
      {token && (
        <div className="mt-2 break-all">
          Token: {token.substring(0, 20)}...
        </div>
      )}
      {token && (
        <button 
          onClick={() => testWishlistAPI(token)}
          className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Test API
        </button>
      )}
    </div>
  );
};

export default AuthDebug;