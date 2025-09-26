// frontend/src/components/Navbar/Navbar.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">GiftLink</a>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={logout} className="btn btn-sm btn-outline-danger ms-2">Logout</button>
          </>
        ) : (
          <a href="/app/login" className="btn btn-sm btn-primary">Login</a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
