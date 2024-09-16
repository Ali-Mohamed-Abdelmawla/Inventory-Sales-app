// AddInventoryPresentation.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Box, Typography } from '@mui/material';
import { InventoryData, AddInventoryPresentationProps } from '../Inventories-interfaces';
import { LoadingButton } from '@mui/lab';
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";


const AddInventoryPresentation: React.FC<AddInventoryPresentationProps> = ({ onSubmit, loading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<InventoryData>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '40%' }}>
      <Typography variant="h6" gutterBottom>
        اضافه مخزن جديد
      </Typography>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: 'اسم المخزن مطلوب' }}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="name"
            label="اسم المخزن"
            autoFocus
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
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

export default AddInventoryPresentation;