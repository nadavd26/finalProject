import LoginButton from './components/login';
import './LoginScreen.css';

function LoginScreen() {
  return (
    <div id='login-screen' style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'flex-start',
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#2C2F33',
      paddingTop: '20px'
    }}>
      <h3 className='animate-charcter' style={{ 
        textAlign: 'center',
        marginTop: '20px', // Adjust this value to lower the heading further
      }}>Employee Scheduler</h3>
      <div className="container py-5" style={{ width: '100%' }}>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong border-dark" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                <h3 className="mb-5" id='login-head'>Sign Up or Log In</h3>
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
