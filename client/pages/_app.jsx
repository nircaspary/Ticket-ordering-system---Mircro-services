import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import Header from "../components/header";
import { buildClient } from "../api/build-client";

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header currentUser={pageProps?.currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  try {
    const { data } = await buildClient(appContext.ctx).get("/api/users/current-user");
    let pageProps = {};
    if (appContext.Component) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return { pageProps, ...data };
  } catch (err) {
    return { err: err.message };
  }
};
export default AppComponent;
