import { GoogleLogin } from 'react-google-login'

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"

const onSuccess = (res) => {
    console.log("Login SUCCESS! current user: ", res.profileObj)
}

const onFailure = (res) => {
    console.log("Login FAILED! res: ", res)
}

function Login() {

    return(
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
    )
}

export default Login;