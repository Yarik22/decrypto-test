import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import AuthWrapper from './components/wrappers/AuthWrapper';
import MessageList from './pages/MessageList';
import Layout from './components/wrappers/Layout';


function App() {

  return (
    <>
    <Routes>
      <Route path='/login' element={LoginPage()}/>
      <Route path='/register' element={RegisterPage()}/>
    </Routes>
    <AuthWrapper>
      <Layout>
      <Routes>
        <Route path='/messages' element={<MessageList/>}/>
      </Routes>
      </Layout>
    </AuthWrapper>
    </>
  );
}


export default App;
