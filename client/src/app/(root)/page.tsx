"use client";

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Typography, Paper, Divider } from '@mui/material';

const LoginPage = () => {
  const handleLogin = (response: any) => {
    console.log('Google login response:', response);
    // Handle the login response (e.g., store token, redirect user)
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Paper
        elevation={12}
        sx={{
          px: 6,
          py: 8,
          maxWidth: 420,
          width: '100%',
          borderRadius: '2xl',
          background: 'linear-gradient(145deg, #0d0d0d, #111)',
          boxShadow: '0 0 32px rgba(0, 255, 127, 0.15)',
          border: '1px solid #222',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #00c853, #b2ff59)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Schedrix
        </Typography>

        <Typography variant="body2" align="center" mb={4} sx={{ color: '#ccc' }}>
          Smart Task Manager for Life & Work
        </Typography>

        <Divider sx={{ mb: 4, borderColor: '#333' }} />

        <Box display="flex" justifyContent="center">
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => console.log('Login Failed')}
            shape="pill"
            theme="filled_black"
            text="signin_with"
            size="large"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
