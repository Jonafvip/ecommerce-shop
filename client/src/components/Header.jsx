import { useAuthContext } from "../context/AuthContext";
import "./Header.css";
import { NavLink } from "react-router-dom";
//componentes
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
export const Header = () => {
  const { user, onLogout } = useAuthContext();

  return (
    <header className="container-header">
      <div className="sub-container">
        <h2 className="header-title">
          <NavLink style={{ textDecoration: "none", color: "#fff " }} to="/">
            Ecommerce - shop
          </NavLink>
        </h2>
        <nav>
          <ul>
            <ul>
              {user ? (
                <Stack spacing={2} direction="row">
                  <NavLink to="/profile">
                    <Button variant="text">Profile</Button>
                  </NavLink>
                  <Button variant="text" onClick={onLogout}>
                    Logout
                  </Button>
                </Stack>
              ) : (
                <li>
                  <NavLink
                    style={{ textDecoration: "none", fontWeight: "bold" }}
                    to="/register"
                  >
                    Log in
                  </NavLink>
                </li>
              )}
            </ul>
          </ul>
        </nav>
      </div>
    </header>
  );
};
