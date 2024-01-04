import { GoogleLogin } from 'react-google-login'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext'
import { serverGetToken } from '../../api/LoginApi';
const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"



function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const onSuccess = async (res) => {
        console.log("Login SUCCESS! current user: ", res.profileObj);
        const token = await serverGetToken(res.profileObj.googleId, res.profileObj.imageUrl, 
            res.profileObj.email, res.profileObj.name, res.profileObj.givenName, res.profileObj.familyName)
        console.log("token is: " + token)
        const userInfo = res.profileObj
        userInfo["token"] = token
        setUser(userInfo)
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