// src/renderer/components/InventoryManager.js
import React, { useEffect, useState } from 'react';
import { showNotification } from '../services/notificationService';

const InventoryManager = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products and check stock levels
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/getAllProducts');
      const data = await response.json();
      setProducts(data);

      // Check for low stock
      data.forEach(product => {
        if (product.quantity <= 10) {  // Assuming 10 is the threshold
          showNotification(
            'Low Stock Alert',
            `Product ${product.name} is running low on stock. Current quantity: ${product.quantity}`
          );
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <h1>Inventory Manager</h1>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} - Quantity: {product.quantity}
          </li>
        ))}
      </ul>
    </div>
  );

};

export default InventoryManager;