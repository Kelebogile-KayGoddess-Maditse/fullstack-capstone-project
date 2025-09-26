import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();
  const bearerToken = sessionStorage.getItem('bearer-token');

  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) navigate('/app');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : ''
        },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (res.ok && json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', json.userName);
        sessionStorage.setItem('email', json.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setIncorrect(json.error || 'Wrong password. Try again.');
        setEmail('');
        setPassword('');
        setTimeout(()=>setIncorrect(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setIncorrect('Login error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4">Login</h2>
            <div className="mb-3">
              <label>Email</label>
              <input id="email" type="text" className="form-control" value={email} onChange={e => { setEmail(e.target.value); setIncorrect('');}}/>
            </div>
            <div className="mb-4">
              <label>Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={e => { setPassword(e.target.value); setIncorrect('');}}/>
              <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
            </div>
            <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
            <p className="mt-4 text-center">New here? <a href="/app/register">Register Here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
