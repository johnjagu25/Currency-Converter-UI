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
import {
  LOC_STORAGE,
  RESPONSE_CODE,
  UNAMEPWDMISSING,
} from "../../constant/constant";
import { useEffect } from "react";

export default function Login({ notify }) {
  const [errorMsg, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("username");
    const passWord = data.get("password");
    if (!(userName && passWord)) {
      setError(UNAMEPWDMISSING);
      return false;
    }
    loginUser(userName, passWord)
      .then((response) => {
        if (response?.code === RESPONSE_CODE.LOGGED_IN) {
          if (response.message) {
            notify(response.message);
          }
          sessionStorage.setItem(LOC_STORAGE.USERNAME, userName);
          sessionStorage.setItem(LOC_STORAGE.TOKEN, response.token);
          navigate("/exchange");
          setError("");
        } else {
          setError(response.message);
        }
      })
      .catch((error) => {
        let msg = error?.message || "Something went wrong";
        setError(msg);
        notify(msg);
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

        <Box component="form"  onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            autoComplete="new-username"
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
