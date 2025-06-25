"use client";

import React from "react";
import axios from "axios";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { GOOGLE_AUTH_ROUTE } from "@/lib/apiRoutes";
import TaskCreationAnimation from "@/components/animations/TaskCreationAnimation";
import RepeatativeTaskSupportAnimation from "@/components/animations/RepeatativeTaskSupportAnimation";
import UITaskReschedulingAnimation from "@/components/animations/UITaskReschedulingAnimation";
import PointContributionGridShow from "@/components/animations/PointContributionGridShow";
import MindStatusTrackShow from "@/components/animations/MindStatusTrackShow";
import QOTDShow from "@/components/animations/QOTDShow";
import FeatureMoodBasedVideos from "@/components/animations/FeatureMoodBasedVideos";

const LoginPage = () => {
  const loginDirect = async () => {
    try {
      window.location.href = `${GOOGLE_AUTH_ROUTE}`;
    } catch (error) {
      console.error("Error initiating Google login:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <div
        style={{
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          margin:"8rem"
        }}
      >
        <Paper
          id="SchedrixLogIn"
          elevation={12}
          sx={{
            px: 6,
            py: 8,
            maxWidth: 420,
            width: "100%",
            borderRadius: "2xl",
            background: "linear-gradient(145deg, #0d0d0d, #111)",
            boxShadow: "0 0 32px rgba(0, 255, 127, 0.15)",
            border: "1px solid #222",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #00c853, #b2ff59)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Schedrix
          </Typography>

          <Typography
            variant="body2"
            align="center"
            mb={4}
            sx={{ color: "#ccc" }}
          >
            Smart Task Manager for Life & Work
          </Typography>

          <Divider sx={{ mb: 4, borderColor: "#333" }} />

          <Box display="flex" justifyContent="center">
            <Button
              onClick={() => loginDirect()}
              startIcon={<GoogleIcon />}
              sx={{
                background: "linear-gradient(to right, #00c853, #b2ff59)",
                color: "#000",
                borderRadius: "999px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  background: "linear-gradient(to right, #00e676, #ccff90)",
                  boxShadow: "0 0 16px #00c85388",
                },
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </Paper>
        <TaskCreationAnimation />
        <RepeatativeTaskSupportAnimation />
        <UITaskReschedulingAnimation />
        <PointContributionGridShow />
        <MindStatusTrackShow />
        <QOTDShow />
        <FeatureMoodBasedVideos />
      </div>
    </Box>
  );
};

export default LoginPage;
