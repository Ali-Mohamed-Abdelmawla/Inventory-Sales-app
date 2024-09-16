// AddProductPresentation.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import {
  ProductsData,
  AddProductsPresentationProps,
} from "../Products-interfaces";
import { SupplierProps } from "../../Suppliers-component/Suppliers-interfaces";
import { InventoryProps } from "../../Inventories-component/Inventories-interfaces";
import { LoadingButton } from "@mui/lab";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";

const AddProductPresentation: React.FC<AddProductsPresentationProps> = ({
  onSubmit,
  loading,
  suppliers,
  inventories,
  onSupplierSearch,
  onInventoriesSearch,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductsData>();

  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierProps | null>(null);
  const [selectedInventories, setSelectedInventories] = useState<Array<{
    inventory: InventoryProps;
    quantity: number;
  }> | null>(null);

  const handleSupplierChange = (
    event: React.ChangeEvent<{}>,
    value: SupplierProps | null
  ) => {
    setSelectedSupplier(value);
    setValue("supplierId", value ? value._id : "");
  };

  const handleInventoriesChange = (
    event: React.ChangeEvent<{}>,
    value: InventoryProps[]
  ) => {
    const newSelectedInventories = value.map((inv) => ({
      inventory: inv,
      quantity: 1,
    }));
    setSelectedInventories(newSelectedInventories);
    setValue(
      "inventories",
      newSelectedInventories.map((item) => ({
        inventory: item.inventory._id,
        quantity: item.quantity,
      }))
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (!selectedInventories) return;
    const newSelectedInventories = [...selectedInventories];
    newSelectedInventories[index].quantity = quantity;
    setSelectedInventories(newSelectedInventories);
    setValue(
      "inventories",
      newSelectedInventories.map((item) => ({
        inventory: item.inventory._id,
        quantity: item.quantity,
      }))
    );
  };

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
            اضافه منتج جديد
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "اسم المنتج مطلوب" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="name"
                label="اسم المنتج"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="price"
            control={control}
            defaultValue={0}
            rules={{
              required: "سعر المنتج مطلوب",
              pattern: {
                value: /^\d+$/,
                message: "القيمه المدخله يجب ان تكون مكونه من أرقام فقط",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="price"
                label="سعر المنتج"
                type="number"
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="supplierId"
            control={control}
            defaultValue=""
            rules={{ required: "المورد مطلوب" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={suppliers}
                getOptionLabel={(option: SupplierProps | string) => {
                  if (typeof option === "string") return option;
                  return option?.name || "";
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="المورد"
                    error={!!errors.supplierId}
                    helperText={errors.supplierId?.message}
                  />
                )}
                onChange={handleSupplierChange}
                onInputChange={(event, value) => onSupplierSearch(value)}
                value={selectedSupplier}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id || option.name === value.name
                }
                renderOption={(props, option: SupplierProps) => (
                  <li {...props} key={option._id}>
                    {option.name}
                  </li>
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="inventories"
            control={control}
            defaultValue={[]}
            rules={{ required: "المخازن مطلوبة" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={inventories}
                getOptionLabel={(option: InventoryProps | string) => {
                  if (typeof option === "string") return option;
                  return option?.name || "";
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="المخازن"
                    error={!!errors.inventories}
                    helperText={errors.inventories?.message}
                  />
                )}
                onChange={(event, value) =>
                  handleInventoriesChange(event, value)
                }
                onInputChange={(event, value) => onInventoriesSearch(value)}
                value={selectedInventories?.map((item) => item.inventory)}
                isOptionEqualToValue={(option: InventoryProps, value: InventoryProps) =>
                  option._id === value._id || option.name === value.name
                }
                renderOption={(props, option: InventoryProps) => (
                  <li {...props} key={option._id}>
                    {option.name}
                  </li>
                )}
              />
            )}
          />
        </Grid>
        {selectedInventories?.map((item, index) => (
          <Grid item xs={6} key={item.inventory._id}>
            {/* // flex direction column */}
            <Box display="flex" flexDirection="column" alignItems="right">
              <Typography sx={{ mb: 2, mt:1 }}>{item.inventory.name}</Typography>
              
                <TextField
                  type="number"
                  label="الكمية"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                  sx={{ ml: 4, width: "auto" }}
                />
              
            </Box>
          </Grid>
        ))}
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

export default AddProductPresentation;
