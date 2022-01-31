import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../service/service";

export default function Login(props) {
  const [errorMsg, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("username");
    let passWord = data.get("password");
    loginUser(userName, passWord)
      .then((response) => {
        if (response?.code === "logged_in") {
          if(response.message){
            props.notify(response.message)
          }      
          sessionStorage.setItem("userName", userName);
          sessionStorage.setItem("token", response.token);
          navigate("/exchange");           
          setError("");
        } else {
          setError(response.message);
        }

      })
      .catch((error) => {
        let msg = error?.message || "Something went wrong";
        setError(msg);
        props.notify(msg)
      });
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
          Sign In
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
            autoComplete="chrome-off"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {errorMsg ? <span style={{ color: "red" }}>* {errorMsg}</span> : ""}
          <Grid container>
            <Grid item sx={{ padding: "10px 0", cursor: "pointer" }}>
              <Link
                onClick={() => {
                  navigate("/signup");
                }}
                variant="body2"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </Container>
  );
}
