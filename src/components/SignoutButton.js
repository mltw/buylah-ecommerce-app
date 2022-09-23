import React from "react";
import { Component } from "react";
import { withAuth0  } from "@auth0/auth0-react";


class SignOutButton extends Component {
    render() {
      // `this.props.auth0` has all the same properties as the `useAuth0` hook
      const { logout } = this.props.auth0;
      
      return (  
        <button onClick={() => {
            // localStorage.setItem("isLoggedIn", false)
            localStorage.setItem("userEmail", "")
            logout({ returnTo: window.location.origin })
            }}>
            Log Out
        </button>
      )
    }
  }
  
  export default withAuth0(SignOutButton);