import './App.css';
import LoginButton from './LoginScreen/components/login';
import LogoutButton from './components/logout';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import TableScreen from './TableScreen/TableScreen';

const clientId = "697357189642-cv95irflcae6i8dm2nidpvokkqtpv62k.apps.googleusercontent.com"

function App() {
  const booleanArray = new Array(48).fill(false);
  booleanArray[0] = true;
  booleanArray[5] = true;
  booleanArray[10] = true;
  const booleanArray2 = new Array(48).fill(false);
  booleanArray2[13] = true;
  booleanArray2[14] = true;
  booleanArray2[15] = true;
  booleanArray2[10] = true;
  booleanArray2[47] = true
  const workersAndShifts = [{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 },{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Nisim\n214437550', shifts: booleanArray2 }]
  return <TableScreen workersAndShifts={workersAndShifts}/>
}

export default App;
