import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";
import roughtConfiguration from "./routes/Route";
import PrivateRouter from "./routes/privateRouter";
import PublicRouter from "./routes/PublicRouter";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/NotFoundPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* <Route exact path="/" element={<LoginPage />} /> */}
            <Route
              exact
              path="/"
              element={
                <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                >
                  <LoginPage />
                </GoogleOAuthProvider>
              }
            />
            {roughtConfiguration.map((route) => {
              if (!!route.auth) {
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    element={<PrivateRouter>{route.component}</PrivateRouter>}
                  />
                );
              } else {
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    element={<PublicRouter>{route.component}</PublicRouter>}
                  />
                );
              }
            })}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
