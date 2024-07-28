import React, { useState } from "react";
import { TextField, Typography, Button, Box, Link as MuiLink, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login, setAdmin } from "../../store/authSlice.js";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const sendData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/login', data, { withCredentials: true });
      if (response.status === 200) {
        dispatch(login(response.data.user));
        if (response.data.user.isAdmin) {
          dispatch(setAdmin());
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authStatus) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(sendData)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        maxWidth: 400,
        margin: "auto",
        marginTop: 8,
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>
      
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Email Address"
        variant="outlined"
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        {...register("password", { 
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Sign In"}
      </Button>
      
      <MuiLink component={Link} to="/register" variant="body2">
        New Here? Register Now
      </MuiLink>
    </Box>
  );
}