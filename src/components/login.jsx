import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../index.css';

/*export default function Home(){
    return(
        <div>login</div>
    )
}
*/

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
            </form>
        </div>
    );
};

export default LoginPage;


