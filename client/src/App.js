import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { gapi } from 'gapi-script';
import LoginScreen from './LoginScreen/LoginScreen';
import UploadScreen from './UploadScreen/UploadScreen';
import TableScreen from './TableScreen/TableScreen'
import { UserContext } from './Context/UserContext'
import EditFile2 from './EditInputScreen/EditFile2/EditFile2';
const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"

function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      })
    }

    gapi.load('client:auth2', start);
  }, []);


  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route exact path="/" element={<LoginScreen />} />
        <Route
          path="/upload"
          element={user ? <UploadScreen user={user} setUser={setUser}/> : <Navigate replace to="/" />}
        />
        <Route
          path="/login"
          element={<LoginScreen />}
        />
        <Route
          path="/table"
          element={user ?
            <TableScreen
            user={user} setUser={setUser}
            /> : <Navigate replace to="/" />
          }
        />
        <Route path="*" element={<LoginScreen />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
