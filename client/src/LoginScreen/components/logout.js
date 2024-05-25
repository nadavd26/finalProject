

// import React from 'react';
// import { GoogleLogout } from 'react-google-login';

// const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com";

// const Logout = (onLogout) => {
//     return (
//         <div
//             id="signOutButton"
//             style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginTop: '20px'
//             }}
//         >
//             <GoogleLogout
//                 clientId={clientId}
//                 buttonText="Logout"
//                 onLogoutSuccess={onLogout}
//                 render={renderProps => (
//                     <button
//                         onClick={renderProps.onClick}
//                         disabled={renderProps.disabled}
//                         style={{
//                             backgroundColor: '#4285F4', /* Google's blue */
//                             color: 'white',
//                             border: 'none',
//                             padding: '10px 20px',
//                             fontSize: '16px',
//                             borderRadius: '5px',
//                             cursor: 'pointer',
//                             transition: 'background-color 0.3s ease'
//                         }}
//                     >
//                         Logout
//                     </button>
//                 )}
//             />
//         </div>
//     );
// };

// export default Logout;

import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom'
import logout from '../Images/logout.png'
import '../css/logout.css'

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com";

function Logout({onLogout}) {

    return(
        <div id = "signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={onLogout}
                render={renderProps => (
                                        <button
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                            id="logout-btn"
                                        >
                                            <img src={logout} style={{width: "30px", height: "30px", position: "relative", right: "2px"}}></img>
                                        </button>
                                    )}
            />
        </div>
    )
}

export default Logout;
