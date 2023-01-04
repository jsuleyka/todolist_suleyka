import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { useState, useEffect } from "react";
import React from "react";
import { Lucide, Notification } from "@/base-components";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "@/api";

function Main() {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  const login = { email, password };
  const [errorMessage, setErrorMessage] = useState(null);
 
  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };
  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const handleSubmitLogin = () => {
    // Obtener mi login
    fetchWithToken('auth/login', login, 'POST').then((res) => { 
      setToken(res.accessToken);
      setUser(res.user);

      localStorage.setItem("token-info", res.accessToken);
      localStorage.setItem("user-info", res.user);

      console.log(res)
      console.log( typeof res.status);

      if (res.success) {
        navigateTo('/');
      }

      if (res.status) {
        console.log('Entra');
        setErrorMessage(res.message);
        console.log(errorMessage);
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

                <Notification message={errorMessage}/>

                <div className="text-center">
                  {/* BEGIN: Notification Content */}
                  <Notification message={errorMessage}
                    // getRef={(el)=> {
                    //   successNotification.current = el;
                    //   }}
                      className="flex"
                      >
                      <Lucide icon="CheckCircle" className="text-success" />
                      <div className="ml-4 mr-4">
                          <div className="font-medium">Message Saved!</div>
                          <div className="mt-1 text-slate-500">
                              The message will be sent in 5 minutes.
                          </div>
                      </div>
                  </Notification>
                  {/* END: Notification Content */}

                  {/* BEGIN: Notification Toggle */}
                  {/* <Button variant="primary" onClick={successNotificationToggle}>
                      Show Notification
                  </Button> */}
                  {/* END: Notification Toggle */}
              </div>

                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  {/* <Link to="/" className="btn btn-primary py-3 px-4 w-full align-top">Login</Link> */}
                  <button 
                    onClick={handleSubmitLogin}
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
    </>
  );
}

export default Main;
