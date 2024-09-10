import { GoogleLogin } from 'react-google-login'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext'
import { serverGetToken } from '../../api/LoginApi';
import { getInputTable } from '../../api/InputTableApi';
const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"



function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    
    
    const onSuccess = async (res) => {
        
        const token = await serverGetToken(res.profileObj.googleId, res.profileObj.imageUrl, 
            res.profileObj.email, res.profileObj.name, res.profileObj.givenName, res.profileObj.familyName)
        
        const userInfo = res.profileObj
        userInfo["token"] = token
        userInfo["table1"] = await getInputTable(1, token)
        userInfo["table2"] = await getInputTable(2, token)
        userInfo["table3"] = await getInputTable(3, token)
        userInfo["algo1Table"] = []
        userInfo["algo2Table"] = []
        setUser(userInfo)
        navigate("/upload")
    };

    const onFailure = (res) => {
        
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