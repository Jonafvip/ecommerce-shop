import "./Header.css";
import { NavLink } from "react-router-dom";
export const Header = () => {
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
            <li>
              <NavLink
                style={{ textDecoration: "none", fontWeight: "bold" }}
                to="/register"
              >
                Log in
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
