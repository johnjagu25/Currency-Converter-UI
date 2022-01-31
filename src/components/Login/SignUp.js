import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import { signUpUser } from "../../service/service";
import { useNavigate } from "react-router-dom";

export default function SignUp(props) {
  const [errorMsg, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let userName = data.get("username");
    let passWord = data.get("password");
    let confPwd = data.get("confirmPwd");
    if (userName && confPwd === passWord) {
      signUpUser(userName, passWord)
        .then((response) => {
          sessionStorage.setItem("userName", userName);
          sessionStorage.setItem("token", response.token);
          if(response.code === 'success'){
            props.notify(response.message)
          }     
          navigate("/exchange");             
        }).catch((error) => {
          if(error?.message){
            props.notify(error.message)
          }          
        });
    } else {
      if (!userName) {
        setError("Please enter your Username");
      } else {
        setError("Password and confirm password doesn't match");
      }
    }
  };
  const containerStyle = {
    background: "white",
    borderRadius: "10px",
  };
  return (
    <Container component="main" maxWidth="xs" style={containerStyle}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ padding: "10px 0" }}>
          Sign Up{" "}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Username"
            name="username"
            autoComplete="chrome-off"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPwd"
            label="Confirm Password"
            type="password"
            id="confirmPwd"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {errorMsg ? <span style={{ color: "red" }}>* {errorMsg}</span> : ""}
        </Box>
      </Box>
    </Container>
  );
}
