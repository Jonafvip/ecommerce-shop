import "./Footer.css";
import { NavLink } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";

export const Footer = () => {
  return (
    <footer className="container-footer">
      <div className="footer-links">
        <NavLink to="/" className="footer-link">
          Home
        </NavLink>
        <NavLink to="/register" className="footer-link">
          Register
        </NavLink>
        <NavLink to="/login" className="footer-link">
          Login
        </NavLink>
      </div>

      <div className="footer-socials">
        <GitHubIcon className="social-icon" fontSize="small" />
        <LinkedInIcon className="social-icon" fontSize="small" />
        <XIcon className="social-icon" fontSize="small" />
        <InstagramIcon className="social-icon" fontSize="small" />
      </div>

      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} Ecommerce Shop. All rights reserved.
      </p>
    </footer>
  );
};
