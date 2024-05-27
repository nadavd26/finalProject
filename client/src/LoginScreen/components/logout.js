import React from 'react';
import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom';
import logout from '../Images/logout.png';
import '../css/logout.css';

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com";

function Logout({ onLogout }) {
    return (
        <div id="signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={onLogout}
                onFailure={(err) => console.log('Logout failed: ', err)}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        id="logout-btn"
                    >
                        <img src={logout} style={{ width: "30px", height: "30px", position: "relative", right: "2px" }} alt="logout" />
                    </button>
                )}
            />
        </div>
    );
}

export default Logout;
