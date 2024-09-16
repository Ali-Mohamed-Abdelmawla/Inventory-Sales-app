// EditProductPresentation.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Autocomplete,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import { ProductsData, EditProductsPresentationProps } from "../Products-interfaces";
import { SupplierProps } from "../../Suppliers-component/Suppliers-interfaces";
import { InventoryProps } from "../../Inventories-component/Inventories-interfaces";

const EditProductPresentation: React.FC<EditProductsPresentationProps> = ({
  product,
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
  } = useForm<ProductsData>({
    defaultValues: {
      name: product.name,
      price: product.price,
      supplierId: product.supplier?._id,
      inventories: product.inventories.map(inv => ({
        inventory: inv.inventory?._id,
        quantity: inv.quantity,
      })),
    },
  });

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProps | null>(product.supplier);
  const [selectedInventories, setSelectedInventories] = useState<Array<{
    inventory: InventoryProps;
    quantity: number;
  }>>(product?.inventories);

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
      quantity: selectedInventories.find(item => item.inventory._id === inv._id)?.quantity || 1,
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
            تعديل المنتج
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "اسم المنتج مطلوب" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="name"
                label="اسم المنتج"
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
                value={selectedInventories.map((item) => item.inventory)}
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
        endIcon={<EditIcon />}
        type="submit"
        loadingPosition="end"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={loading}
      >
        تعديل
      </LoadingButton>
    </Box>
  );
};

export default EditProductPresentation;