// EditInventoryPresentation.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import { InventoryProps, InventoryData } from '../Inventories-interfaces';

interface ProductType {
  _id: string;
  name: string;
  price: number;
  supplier: {
    _id: string;
    name: string;
  };
  inventories: {
    inventory: string;
    quantity: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface EditInventoryPresentationProps {
  inventory: InventoryProps;
  products: ProductType[];
  loading: boolean;
  onSubmit: (data: InventoryData) => Promise<void>;
}

const EditInventoryPresentation: React.FC<EditInventoryPresentationProps> = ({
  inventory,
  products,
  loading,
  onSubmit
}) => {
  const { control, handleSubmit } = useForm<InventoryData>({
    defaultValues: {
      name: inventory.name
    }
  });

  const onSubmitForm = (data: InventoryData) => {
    onSubmit(data);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
    تعديل المخرن
      </Typography>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'اسم المخزن مطلوب' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="اسم المخزن"
              error={!!error}
              helperText={error?.message}
              margin="normal"
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'حفظ'}
        </Button>
      </form>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        المنتجات المتوفره بداخل هذا المخزن
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الاسم</TableCell>
                <TableCell>السعر</TableCell>
                <TableCell>المورد</TableCell>
                <TableCell>الكميه</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.supplier.name}</TableCell>
                  <TableCell>
                    {product.inventories.find(inv => inv.inventory === inventory._id)?.quantity || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>لا توجد منتجات في هذا المخرن.</Typography>
      )}
    </Box>
  );
};

export default EditInventoryPresentation;