import { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAdmin } from "../../stores";

export const PrivateRoute = ({ component: Component, children, ...rest }: any) => {
  const status = useAdmin((state) => state.status);
  const init = useAdmin((state) => state.init);
  const me = useAdmin((state) => state.me);
  useEffect(() => {
    init();
  }, []);
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (status === "loading") return <></>;
        else if (me) {
          if (Component) return <Component {...props} />;
          else if (children) return { children };
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};
