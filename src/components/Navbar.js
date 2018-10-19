import React from "react";
import { inject, observer } from "mobx-react";

const LogInOut = props => {
  if (!props.isAuthenticated) {
    return <button onClick={props.login}>Login</button>;
  }

  return <button onClick={props.logout}>Logout</button>;
};

const Navbar = inject("identityStateTree", "auth")(
  observer(({ identityStateTree, auth }) => {
    const { name, state, isAuthenticated } = identityStateTree;
    const { login, logout } = auth;
    return (
      <div>
        <p style={{ display: "inline-block", marginRight: "0.5rem" }}>{name}</p>
        <LogInOut
          state={state}
          isAuthenticated={isAuthenticated}
          login={login}
          logout={logout}
        />
        <p>{state}</p>
      </div>
    );
  })
);

// const Navbar = inject("auth", "store")(
//   observer(
//     class Navbar extends Component {
//       login = () => {
//         this.props.auth.login();
//       };

//       logout = () => {
//         this.props.auth.logout();
//       };

//       isAuthenticated = () => {
//         this.props.auth.isAuthenticated();
//       };

//       render() {
//         return (
//           <div>
//             <p style={{ display: "inline-block", paddingRight: "1rem" }}>
//               Nav Bar: {this.props.store.name}
//             </p>
//             <button onClick={this.login}>Login</button>
//             <button onClick={this.logout}>Logout</button>
//             <button onClick={this.isAuthenticated}>isAuthenticated</button>{" "}
//           </div>
//         );
//       }
//     }
//   )
// );

export default Navbar;
