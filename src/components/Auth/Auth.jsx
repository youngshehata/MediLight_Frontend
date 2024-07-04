import { useContext } from "react";
import { RolesContext } from "../../App";
import { authorizeURL } from "../../utilities/auth";

export default function Auth({ componentJSX, authRole }) {
  const roles = useContext(RolesContext);
  const authorized = authorizeURL(authRole, roles);
  if (authorized) {
    return componentJSX;
  }
}
