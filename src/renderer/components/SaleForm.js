import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Snackbar,
} from "@mui/material";
import axios from "axios";

function SaleForm() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products/getAllProducts")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      setSnackbarMessage("Please select a product");
      setOpenSnackbar(true);
      return;
    }

    const saleData = {
      products: [{ product: selectedProduct, quantity: parseInt(quantity) }],
    };

    axios
      .post(
        "http://localhost:5000/api/sales",
        {
          name: "Sale",
          price: 300,
          quantity: 400,
          supplier: "Supplier A",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.json())
      .then((data) => {
        setSnackbarMessage("Sale submitted successfully");
        setOpenSnackbar(true);
        setSelectedProduct("");
        setQuantity(1);
        // fetchProducts(); 
        // Refresh the product list to show updated quantities
      })
      .catch((error) => {
        console.error("Error submitting sale:", error);
        setSnackbarMessage("Error submitting sale");
        setOpenSnackbar(true);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">New Sale</Typography>
      <Select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        fullWidth
        margin="normal"
      >
        {products.map((product) => (
          <MenuItem key={product._id} value={product._id}>
            {product.name} (In stock: {product.quantity})
          </MenuItem>
        ))}
      </Select>
      <TextField
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        margin="normal"
        label="Quantity"
        inputProps={{ min: 1 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Sale
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </form>
  );
}

export default SaleForm;
