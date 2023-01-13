import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import React from "react";
import { useState, useEffect } from "react";
import { Alert, Lucide } from "@/base-components";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "@/api";

function Main() {
  const navigateTo = useNavigate();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  // const [stateAlert, setStateAlert] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const login = { email, password };
  
  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };
  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const notify = msg => toast(msg);

  const handleLogin = () => {
    // Obtener mi login
    fetchWithToken('auth/login', login, 'POST').then((res) => {
      if (res.success) {
        const currentUser = JSON.stringify(res.user);
        setToken(res.accessToken);
        console.log(token);

        localStorage.setItem("token-info", res.accessToken);
        localStorage.setItem("user-info", currentUser);
        navigateTo('/admin');
      }

      if (res.status) {
        // setErrorMessage(res.message);
        // setStateAlert(true);
        // notify(res.message);

        setNotification({
          type: "error",
          message: res.message,
        });
      }
    });
  }

  useEffect(() => {
    dom("body").removeClass("main").removeClass("error-page").addClass("login");
  }, []);

  return (
    <>
      <div>
        <DarkModeSwitcher />
        <div className="container sm:px-10">
          <div className="block xl:grid grid-cols-2 gap-4">
            {/* BEGIN: Login Info */}
            <div className="hidden xl:flex flex-col min-h-screen">
              <a href="" className="-intro-x flex items-center pt-5">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="text-white text-3xl ml-3"> Suleyka API </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="-intro-x w-1/2 -mt-16"
                  src={illustrationUrl}
                />
                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                  A few more clicks to <br />
                  sign in to your account.
                </div>
                {/* <div className="-intro-x mt-5 text-lg text-teal text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div> */}
              </div>
            </div>
            {/* END: Login Info */}

            {/* BEGIN: Login Form */}
            <div className="xl:shadow-lg h-screen xl:h-auto flex py-5 xl:py-0 my-2 xl:my-0">
              <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                  Sign In
                </h2>
                <div className="intro-x mt-8">
                  <input
                    type="text"
                    className="intro-x login__input form-control py-3 px-4 block"
                    placeholder="Email"
                    onChange={handleChangeEmail}
                  />
                  <input
                    type="password"
                    className="intro-x login__input form-control py-3 px-4 block mt-4"
                    placeholder="Password"
                    onChange={handleChangePassword}
                  />
                </div>
                {/* <ToastContainer className="toastify-content" /> */}

                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  <button 
                    onClick={handleLogin}
                    className="btn btn-primary py-3 px-4 w-full align-top">
                    Login
                  </button>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>

      {/* BEGIN: Alert Content */}       
      {notification.type.includes("error") && (
        <Alert className="fixed z-50 top-[5vw] right-[5vw] alert-danger w-[20vw] flex items-center mb-2">
          {({ dismiss }) => (
            <>
              <Lucide icon="AlertOctagon" className="w-6 h-6 mr-2" />
              <span>{notification.message}</span>
              <button
                type="button"
                className="btn-close text-white"
                aria-label="Close"
                onClick={() => {
                  dismiss();
                  setNotification({ type: "", message: "" });
                }}
              >
                <Lucide icon="X" className="ml-5 w-4 h-4" />
              </button>
            </>
          )}
        </Alert>
      )}
      {/* END: Alert Content */}
    </>
  );
}

export default Main;
