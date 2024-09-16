// LoginForm.tsx
import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Avatar,
  FormHelperText,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";

//interfaces
import { LoginFormInputs } from "../../interfaces/Login-interfaces";
import { LoginFormProps } from "../../interfaces/Login-interfaces";

// this is just a custom thing
interface RestOfLoginFormProps extends LoginFormProps {
  register: UseFormRegister<LoginFormInputs>;
  errors: FieldErrors<LoginFormInputs>;
}

const LoginForm: React.FC<RestOfLoginFormProps> = ({
  register,
  errors,
  onSubmit,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        تسجيل الدخول
      </Typography>
      <Box
        component="form"
        onSubmit={onSubmit}
        onKeyPress={handleKeyPress}
        noValidate
        sx={{ mt: 1, width: "100%", maxWidth: 400 }}
      >
        <FormControl fullWidth margin="normal" error={!!errors.email}>
          <InputLabel htmlFor="email">البريد الإلكتروني</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            label="البريد الإلكتروني"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
            })}
          />
          {errors.email && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.password}
          variant="outlined"
        >
          <InputLabel htmlFor="password">كلمة المرور</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="كلمة المرور"
            {...register("password", {
              required: "كلمة المرور مطلوبة",
              minLength: {
                value: 6,
                message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
              },
            })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            inputProps={{
              autoComplete: "new-password",
              form: {
                autoComplete: "off",
              },
            }}
          />
          {errors.password && (
            <FormHelperText>{errors.password.message}</FormHelperText>
          )}
        </FormControl>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={loading}
          loadingPosition="end"
          endIcon={<LoginIcon />}
        >
          <span>تسجيل الدخول</span>
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default LoginForm;
