import { GoogleLogin } from 'react-google-login'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext'

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"



function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const onSuccess = (res) => {
        console.log("Login SUCCESS! current user: ", res.profileObj);
        setUser(res.profileObj)
        navigate("/upload")
    };

    const onFailure = (res) => {
        console.log("Login FAILED! res: ", res);
    };

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