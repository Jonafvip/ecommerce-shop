import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import "./Header.css";
import { NavLink } from "react-router-dom";
//componentes
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

//
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

export const Header = () => {
  const { user, onLogout } = useAuthContext();
  const { cartCount } = useCartContext();

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
            {user ? (
              <Stack spacing={2} direction="row" alignItems="center">
                <NavLink
                  to="/cart"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <IconButton aria-label="cart" color="inherit">
                    <StyledBadge badgeContent={cartCount} color="secondary">
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                </NavLink>
                <NavLink to="/profile" style={{ textDecoration: "none" }}>
                  <Button variant="text">Profile</Button>
                </NavLink>
                <Button variant="text" onClick={onLogout}>
                  Logout
                </Button>
              </Stack>
            ) : (
              <li>
                <NavLink
                  style={{
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                  to="/register"
                >
                  Log in
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
