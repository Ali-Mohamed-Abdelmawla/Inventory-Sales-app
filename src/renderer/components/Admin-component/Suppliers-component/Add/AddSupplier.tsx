// AddSupplierPresentation.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Typography, Grid, Autocomplete } from "@mui/material";
import {
  SupplierData,
  AddSupplierPresentationProps,
  SupplierProps,
} from "../Suppliers-interfaces";
import { LoadingButton } from "@mui/lab";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";

const AddSupplierPresentation: React.FC<AddSupplierPresentationProps> = ({
  onSubmit,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierData>();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ ml: 3, width: 850 }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            اضافه مورد جديد
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "اسم المورد مطلوب" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="name"
                label="اسم المورد"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="contactPerson"
            control={control}
            defaultValue=""
            rules={{
              required: "اسم الشخص المسؤول مطلوب",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="contactPerson"
                label="الشخص المسؤول"
                type="text"
                error={!!errors.contactPerson}
                helperText={errors.contactPerson?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "البريد الالكتروني مطلوب",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "البريد الالكتروني غير صحيح",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="البريد الالكتروني"
                type="text"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^\d+$/,
                message: "القيمه المدخله يجب ان تكون مكونه من أرقام فقط",
                
              },
              minLength: {
                value: 12,
                message: 'يجب ان لا يقل رقم الهاتف عن 12 رقم',
              },
              maxLength:{
                value: 15,
                message: 'يجب ان لا يزيد رقم الهاتف عن 15 رقم',
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="phone"
                label="رقم الهاتف"
                type="text"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{
              required: "العنوان مطلوب",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="address"
                label="العنوان"
                type="text"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <LoadingButton
        endIcon={<AddBoxTwoToneIcon />}
        type="submit"
        loadingPosition="end"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={loading}
      >
        اضافة
      </LoadingButton>
    </Box>
  );
};

export default AddSupplierPresentation;
