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

  const booleanArray = new Array(48).fill(false);
  // Set some elements to true
  booleanArray[0] = true;
  booleanArray[5] = true;
  booleanArray[10] = true;
  // Add more true values
  booleanArray[15] = true;
  booleanArray[20] = true;
  booleanArray[25] = true;
  // ... continue adding more true values as needed
  const booleanArray2 = new Array(48).fill(false);
  booleanArray2[13] = true;
  booleanArray2[14] = true;
  booleanArray2[15] = true;
  booleanArray2[10] = true;
  booleanArray2[47] = true
  const workersAndShifts1 = [{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }]
  const workersAndShifts2 = [
    { name: 'Emily Brown', shifts: booleanArray },
    { name: 'Daniel Martinez', shifts: booleanArray2 },
    { name: 'Sophia Wilson', shifts: booleanArray2 },
    { name: 'Matthew Taylor', shifts: booleanArray },
    { name: 'Emily Brown', shifts: booleanArray },
    { name: 'Daniel Martinez', shifts: booleanArray2 },
    { name: 'Sophia Wilson', shifts: booleanArray2 },
    { name: 'Matthew Taylor', shifts: booleanArray },
    { name: 'Emily Brown', shifts: booleanArray },
    { name: 'Daniel Martinez', shifts: booleanArray2 },
    { name: 'Sophia Wilson', shifts: booleanArray2 },
    { name: 'Matthew Taylor', shifts: booleanArray },
    { name: 'Emily Brown', shifts: booleanArray },
    { name: 'Daniel Martinez', shifts: booleanArray2 },
    { name: 'Sophia Wilson', shifts: booleanArray2 },
    { name: 'Matthew Taylor', shifts: booleanArray },
    { name: 'Emily Brown', shifts: booleanArray },
    { name: 'Daniel Martinez', shifts: booleanArray2 },
    { name: 'Sophia Wilson', shifts: booleanArray2 },
    { name: 'Matthew Taylor', shifts: booleanArray }
  ];

  // Workers for Tuesday
  const workersAndShifts3 = [
    { name: 'Olivia Anderson', shifts: booleanArray },
    { name: 'Liam Thomas', shifts: booleanArray2 },
    { name: 'Emma Garcia', shifts: booleanArray },
  ];

  // Workers for Wednesday
  const workersAndShifts4 = [
    { name: 'Ethan Moore', shifts: booleanArray2 },
    { name: 'Ava Hall', shifts: booleanArray },
    { name: 'Jackson King', shifts: booleanArray },
    { name: 'Sophie Green', shifts: booleanArray2 },
  ];

  // Workers for Thursday
  const workersAndShifts5 = [
    { name: 'Noah Lewis', shifts: booleanArray },
    { name: 'Isabella White', shifts: booleanArray2 },
  ];

  // Workers for Friday
  const workersAndShifts6 = [
    { name: 'Mia Clark', shifts: booleanArray },
    { name: 'Logan Adams', shifts: booleanArray },
    { name: 'Grace Miller', shifts: booleanArray2 },
  ];

  // Workers for Saturday
  const workersAndShifts7 = [
    { name: 'Lucas Turner', shifts: booleanArray },
    { name: 'Ella Scott', shifts: booleanArray },
    { name: 'Aiden Reed', shifts: booleanArray2 },
  ];

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
              daysWorkersAndShifts={{
                Sunday: workersAndShifts1,
                Monday: workersAndShifts2,
                Tuesday: workersAndShifts3,
                Wednesday: workersAndShifts4,
                Thursday: workersAndShifts5,
                Friday: workersAndShifts6,
                Saturday: workersAndShifts7,
              }}
            /> : <Navigate replace to="/" />
          }
        />
        <Route path="*" element={<LoginScreen />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
