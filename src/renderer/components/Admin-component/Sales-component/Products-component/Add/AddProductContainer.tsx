// AddProductContainer.tsx
import React, { useState, useCallback } from "react";
import AddProductPresentation from "./AddProduct";
import { useProductsApi } from "../useProductsApi";
import { ProductsData } from "../Products-interfaces";
import { SupplierProps } from "../../Suppliers-component/Suppliers-interfaces";
import { InventoryProps } from "../../Inventories-component/Inventories-interfaces";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import { useNavigate } from "react-router-dom";
import { useSuppliersApi } from "../../Suppliers-component/useSupplierApi";
import { useInventoriesApi } from "../../Inventories-component/useInventoriesApi";

const AddProductContainer: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct } = useProductsApi();
  const { searchSuppliers } = useSuppliersApi();
  const { searchInventories } = useInventoriesApi();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);
  const [inventories, setInventories] = useState<InventoryProps[]>([]);

  const handleInventoriesSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm) {
      setInventories([]);
      return;
    }
    try {
      const fetchedInventories = await searchInventories(searchTerm);
      setInventories(fetchedInventories);
    } catch (error) {
      console.error("Error searching inventories:", error);
      setInventories([]);
    }
  }, []);

  const handleSupplierSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm) {
      setSuppliers([]);
      return;
    }
    try {
      const fetchedSuppliers = await searchSuppliers(searchTerm);
      setSuppliers(fetchedSuppliers);
    } catch (error) {
      console.error("Error searching suppliers:", error);
      setSuppliers([]);
    }
  }, []);

  const handleSubmit = async (data: ProductsData) => {
    setLoading(true);
    try {
      await addProduct(data);
      sweetAlertInstance
        .fire({
          icon: "success",
          title: "تمت العملية بنجاح",
          text: "تمت اضافة المنتج بنجاح.",
        })
        .then(() => {
          navigate("/SystemAdmin/Product");
        });
    } catch (error) {
      console.error("Error creating product:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ اثناء اضافة المنتج.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddProductPresentation
      onSubmit={handleSubmit}
      loading={loading}
      suppliers={suppliers}
      inventories={inventories}
      onSupplierSearch={handleSupplierSearch}
      onInventoriesSearch={handleInventoriesSearch}
    />
  );
};

export default AddProductContainer;