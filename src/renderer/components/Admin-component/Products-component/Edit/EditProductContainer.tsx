// EditProductContainer.tsx
import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditProductPresentation from "./EditProduct";
import { useProductsApi } from "../useProductsApi";
import { ProductsProps, ProductsData } from "../Products-interfaces";
import { SupplierProps } from "../../Suppliers-component/Suppliers-interfaces";
import { InventoryProps } from "../../Inventories-component/Inventories-interfaces";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import { useSuppliersApi } from "../../Suppliers-component/useSupplierApi";
import { useInventoriesApi } from "../../Inventories-component/useInventoriesApi";
import Loader from "../../../../helper/loading-component/loader";

const EditProductContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { editProduct } = useProductsApi();
  const { searchSuppliers } = useSuppliersApi();
  const { searchInventories } = useInventoriesApi();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductsProps | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);
  const [inventories, setInventories] = useState<InventoryProps[]>([]);

  useEffect(() => {
    console.log(location);
    if (location.state?.product) {
      setProduct(location.state.product);
    }
  }, [location.state]);

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
    if (!product) return;
    setLoading(true);
    try {
      await editProduct(product._id, data);
      sweetAlertInstance
        .fire({
          icon: "success",
          title: "تمت العملية بنجاح",
          text: "تم تعديل المنتج بنجاح.",
        })
        .then(() => {
          navigate("/SystemAdmin/Product");
        });
    } catch (error) {
      console.error("Error updating product:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ اثناء تعديل المنتج.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    console.error("Product not found");
    return <Loader />;
  }

  return (
    <EditProductPresentation
      product={product}
      onSubmit={handleSubmit}
      loading={loading}
      suppliers={suppliers}
      inventories={inventories}
      onSupplierSearch={handleSupplierSearch}
      onInventoriesSearch={handleInventoriesSearch}
    />
  );
};

export default EditProductContainer;