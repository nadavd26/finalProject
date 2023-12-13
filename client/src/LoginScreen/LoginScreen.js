import LoginButton from './components/login';
import './LoginScreen.css';

function LoginScreen(callback) {

  return (
    <div id='login-screen'>
      <div class="container py-5 h-100">
        <h3 className='animate-charcter'>Employee Scheduler</h3>
        <div class="row d-flex justify-content-center align-items-center h-75">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong border-dark" style={{ borderRadius: '1rem' }}>
              <div class="card-body p-5 text-center">

                <h3 class="mb-5" id='login-head'>Sign Up or Log In</h3>
                
                <LoginButton />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;