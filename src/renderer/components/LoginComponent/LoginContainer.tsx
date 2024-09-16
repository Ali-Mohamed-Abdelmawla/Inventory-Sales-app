import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../auth/axios";
import LoginForm from "./Loginform";
import { Container, Box } from "@mui/material";

import { LoginFormInputs } from "../../interfaces/Login-interfaces";

const LoginContainer: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setLoading(true);
    axiosInstance
      .post(
        "/users/login",
        { username: data.email, password: data.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        sessionStorage.setItem("accessToken", response.data.token);
          navigate("/SystemAdmin", {
            state: { adminData: response.data.data },
          });
        // if (response.data.data.role === "admin") {
        //   navigate("/SystemAdmin", {
        //     state: { adminData: response.data.data },
        //   });
        // }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <LoginForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          loading={loading}
        />
      </Container>
    </Box>
  );
};

export default LoginContainer;
