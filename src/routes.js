import { Routes, Route, Navigate } from 'react-router-dom';
// layouts
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import DashboardLayout from './layouts/dashboard';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import User from './pages/User';
import NotFound from './pages/Page404';
import Banner from './pages/Banner';
import Region from './pages/Region';
import Enterprise from './pages/Enterprise';
import VehicleCategory from './pages/VehicleCategory';
import Wallet from './pages/Wallet';
import Driver from './pages/Driver';
import WalletRecharge from './pages/WalletRecharge';
import Post from './pages/Post';
import Premium from './pages/Premium';
import Banking from './pages/Banking';
import Booking from './pages/Booking';
import Notification from './pages/Notification';
import BookingDeposit from './pages/BookDeposit';
import BookingByAdmin from './pages/BookingByAdmin';
import Indentity from './pages/Indentity';
import SettingPage from './pages/Setting';

// ----------------------------------------------------------------------

function getToken() {
  const tokenString = localStorage.getItem('user');
  const userToken = JSON.parse(tokenString);
  return userToken?.accessToken;
}

function Router() {
  const token = getToken();
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [snackContent, setSnackContent] = useState('');
  const [snackType, setSnackType] = useState('info');

  const showSnack = (variant, message) => {
    console.log(variant, message);
    setSnackType(variant);
    setSnackContent(message);
    setIsSnackBarOpen(true);
  };

  if (!token) {
    return <Login />;
  }

  const decode = JSON.parse(atob(token.split('.')[1]));
  console.log(decode);
  if (decode.exp * 1000 < new Date().getTime()) {
    console.log('Time Expired');
    return <Login />;
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSnackBarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackBarOpen(false)}
      >
        <Alert severity={snackType} sx={{ width: '100%' }}>
          {snackContent}
        </Alert>
      </Snackbar>
      <Routes>
        <Route index element={<Navigate to="/dashboard/app" replace />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="app" element={<DashboardApp />} />
          <Route path="user" element={<User />} />
          <Route path="banner" element={<Banner />} />
          <Route path="region" element={<Region />} />
          <Route path="enterprise" element={<Enterprise />} />
          <Route path="vehicle-category" element={<VehicleCategory />} />
          <Route path="post" element={<Post />} />
          <Route path="premium-package" element={<Premium />} />
          <Route path="banking" element={<Banking />} />
          <Route path="booking" element={<Booking />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="notification" element={<Notification />} />
          <Route path="book-deposit" element={<BookingDeposit />} />
          <Route path="book-by-admin" element={<BookingByAdmin />} />
          <Route path="indentity" element={<Indentity />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="driver" element={<Driver />} />
          <Route path="walletRecharge" element={<WalletRecharge />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Router;
