import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import AuthWrapper from './components/wrappers/AuthWrapper';
import Home from './pages/Home';
import { Provider } from 'react-redux';


function App() {

  return (
    <>
    <Routes>
      <Route path='/login' element={LoginPage()}/>
      <Route path='/register' element={RegisterPage()}/>
    </Routes>
    <AuthWrapper>
      <Routes>
        <Route path='/home' element={Home()}/>
      </Routes>
    </AuthWrapper>
    </>
  );
}


export default App;
