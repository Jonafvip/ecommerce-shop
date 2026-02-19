import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Layout } from "../../layout/layout";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const initalValue = {
  email: "",
  password: "",
};

export const Login = () => {
  const [formValue, setFormValue] = useState(initalValue);

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        formValue,
        {
          withCredentials: true,
        }
      );
      setFormValue(initalValue);
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response.data.errors);
    }
  };
  return (
    <Layout>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ "& > :not(style)": { m: 2, width: "35ch" } }}
        noValidate
        autoComplete="off"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <TextField
          id="outlined-email"
          label="email"
          type="email"
          onChange={onChange}
          name="email"
          value={formValue.email}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          onChange={onChange}
          name="password"
          value={formValue.password}
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
        <p style={{ textAlign: "center" }}>
          You already have an account?,{" "}
          <NavLink style={{ textDecoration: "none" }} to="/register">
            sign up
          </NavLink>
        </p>
      </Box>
    </Layout>
  );
};
