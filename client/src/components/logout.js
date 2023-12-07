import { GoogleLogout } from "react-google-login";

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com";
function Logout() {
    const onSuccess = () => {
        console.log("logout success")
    }

    return(
        <div id = "signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;