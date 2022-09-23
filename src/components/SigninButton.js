import React from "react";
import { Component } from "react";
import { withAuth0  } from "@auth0/auth0-react";

// const LoginButton = () => {
//   const { loginWithRedirect } = useAuth0();

//   return <button onClick={() => loginWithRedirect()}>Log In</button>;
// };

// export default LoginButton;


class SigninButton extends Component {
    render() {
      // `this.props.auth0` has all the same properties as the `useAuth0` hook
      const { loginWithRedirect } = this.props.auth0;
      
      return <button onClick={() => loginWithRedirect()}>Log In</button>;
    }
  }
  
  export default withAuth0(SigninButton);