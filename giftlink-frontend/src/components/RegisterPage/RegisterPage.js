import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showerr, setShowerr]     = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const json = await response.json();

      if (response.ok && json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', firstName);
        sessionStorage.setItem('email', json.email);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setShowerr(json.error || 'Registration failed');
      }
    } catch (e) {
      console.error(e);
      setShowerr('Registration error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4">Register</h2>
            <div className="mb-3">
              <label>FirstName</label>
              <input type="text" className="form-control" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label>LastName</label>
              <input type="text" className="form-control" value={lastName} onChange={e=>setLastName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input type="text" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
              <div className="text-danger">{showerr}</div>
            </div>
            <div className="mb-4">
              <label>Password</label>
              <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
            <p className="mt-4 text-center">Already a member? <a href="/app/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
