import { GoogleLogin } from 'react-google-login'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'; // Adjust the path accordingly

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"



function Login() {
    const navigate = useNavigate();
    const { isLoggedIn, login } = useAuth(); // Destructure the login function from useAuth
    const onSuccess = (res) => {
        console.log("Login SUCCESS! current user: ", res.profileObj);
        login();
    };

    const onFailure = (res) => {
        console.log("Login FAILED! res: ", res);
    };

    useEffect(() => {
        console.log("is logged in: " + isLoggedIn);
        if (isLoggedIn) {
            navigate('/upload');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                theme='dark'
            />
        </div>
    );
}

export default Login;