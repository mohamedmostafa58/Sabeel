import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./app.module.css";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Registration from "./components/Registration";
import ResetPassword from "./components/ResetPassword";
import Verification from "./components/Verification";
import Videocapture from "./components/Videocapture";
import { fetchUserByToken } from "./redux/authSlice";
import Support from "./components/Support";
import Wallet from "./components/Wallet";
import Aboutus from "./components/Aboutus";
import Privacy from "./components/Privacy";
function App() {
  const dispatch = useDispatch();
  const { authToken, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authToken && !user.username) {
      dispatch(fetchUserByToken(authToken));
    }
  }, [authToken, dispatch, user]);
  return (
    <div className={styles.App}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                authToken ? (
                  user.username ? (
                    <Home />
                  ) : (
                    <h1>loading</h1>
                  )
                ) : (
                  <Navigate to="login" />
                )
              }
            />
            <Route path="register" element={<Registration />} />
            <Route path="verify" element={<Verification />} />
            <Route path="login" element={<Login />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route
              path="passwordreset/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="video" element={<Videocapture />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="support" element={<Support/>} />
            <Route path="aboutus" element={<Aboutus/>} />
            <Route path="privacy" element={<Privacy/>} />


          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
