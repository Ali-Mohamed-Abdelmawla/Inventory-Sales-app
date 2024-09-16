import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/products/getAllProducts')
  //     .then(response => response.json())
  //     .then(data => setProducts(data))
  //     .catch(error => console.error('Error fetching products:', error));
  // }, []);

  return (
    <div>
      <Typography variant="h6">Product List</Typography>
      <List>
        {products.map(product => (
          <ListItem key={product._id}>
            <ListItemText
              primary={product.name}
              secondary={`Price: $${product.price} | Quantity: ${product.quantity}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ProductList;