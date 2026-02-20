import { useEffect, useState } from "react";
import { Layout } from "../layout/layout";
import axios from "axios";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
//Componentes
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const Home = () => {
  const { user } = useAuthContext();
  const [productsApi, setProductsApi] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.welcome && user) {
      toast.success(`¡Bienvenido de nuevo ${user.username}!`, {
        id: "welcome-toast",
        duration: 4000,
        position: "top-center",
      });
      window.history.replaceState({}, document.title);
    }
  }, [location, user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/admin/product/",
        { withCredentials: true }
      );
      setProductsApi(response.data.data);
    } catch (error) {
      console.error(error.response.data.errors);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <h2>WELCOME TO ECOMMERCE</h2>

      <Box
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"center"}
        gap={6}
        sx={{ padding: 4 }}
      >
        {productsApi.map((pro) => (
          <Card
            key={pro.id}
            sx={{
              width: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {pro.name}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6" color="primary">
                  ${pro.price}
                </Typography>
                <Typography
                  variant="body2"
                  color={pro.stock > 0 ? "success.main" : "error.main"}
                >
                  {pro.stock > 0 ? `Stock: ${pro.stock}` : "Out of Stock"}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 2,
                  height: 60,
                  overflow: "hidden",
                }}
              >
                {pro.description}
              </Typography>
            </CardContent>
            <CardActions
              sx={{ borderTop: "1px solid #eee", justifyContent: "center" }}
            >
              <Button size="medium" variant="contained" fullWidth>
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Layout>
  );
};
