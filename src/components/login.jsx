import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import { useNavigate,Link } from 'react-router-dom';
import '../index.css';

const LoginPage=()=>{
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const navigate = useNavigate();

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Username:",username);
        console.log("Password:",password);
        navigate('/home');
    };

    return(
        <div className='login-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input 
                      type='text'
                      id='username'
                      value={username}
                      onChange={(e)=>setUsername(e.target.value)}
                      placeholder='Username'
                      required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input 
                      type='text'
                      id='password'
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      placeholder='Password'
                      required
                    />
                </div>
                <button type='submit'>Login</button>
                <h3 className='dont-have-account'>Don't have an account?</h3>
                <h3 className='sign-up'><Link to="/signup">Signup</Link></h3>
            </form>
        </div>
    );
};

export default LoginPage;


