import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom'

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com";

function Logout({onLogout}) {

    return(
        <div id = "signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={onLogout}
            />
        </div>
    )
}

export default Logout;