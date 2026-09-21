import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PageNotFound from './pages/Pagenotfound';
import Protecteduser from './protected/protected';
import Loginregister from './protected/loginregister';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes wrapped in Loginregister to prevent authenticated users from viewing them */}
        <Route path="/" element={<Loginregister Component={Login} />} />
        <Route path="/register" element={<Loginregister Component={Register} />} />
        <Route path="/forgotpassword" element={<Loginregister Component={ForgotPassword} />} />
        <Route path="/resetpassword/:id/:token" element={<Loginregister Component={ResetPassword} />} />

        {/* Protected routes */}
        <Route path="/home" element={<Protecteduser Component={Home} />} />
        <Route path="/profile/:id" element={<Protecteduser Component={Profile} />} />

        {/* 404 Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;