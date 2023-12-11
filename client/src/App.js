import './App.css';
import LoginButton from './LoginScreen/components/login';
import LogoutButton from './components/logout';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import LoginScreen from './LoginScreen/LoginScreen';

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };

    gapi.load('client:auth2', start);
  });

  return (
    <div className="App">
      <LoginScreen />
    </div>
  );
}

export default App;
