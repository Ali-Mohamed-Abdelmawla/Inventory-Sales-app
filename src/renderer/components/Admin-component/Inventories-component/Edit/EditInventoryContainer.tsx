// EditInventoryContainer.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInventoriesApi } from "../useInventoriesApi";
import { InventoryProps, InventoryData } from "../Inventories-interfaces";
import EditInventoryPresentation from "./EditInventory";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import Loader from "../../../../helper/loading-component/loader";

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

const EditInventoryContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { editInventory, getProductsByInventory } = useInventoriesApi();
  const [inventory, setInventory] = useState<InventoryProps | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.inventory) {
      setInventory(location.state.inventory);
      fetchProducts(location.state.inventory._id);
    }
  }, [location.state]);

  const fetchProducts = async (id: string) => {
    setLoading(true);
    try {
      const products = await getProductsByInventory(id);
      setProducts(products || []); // Ensure we set an empty array if no products
      console.log("Fetched products:", products); // Log the fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: InventoryData) => {
    if (!inventory) return;
    setLoading(true);
    try {
      await editInventory(inventory._id, data).then((response) => {
        console.log("Inventory updated:", response);
        if (
          response?.response?.data?.message.includes(
            "An inventory with this name already exists"
          )
        ) {
          sweetAlertInstance.fire({
            icon: "error",
            title: "خطأ",
            text: "عذراً، هناك مخزن مسجل بهذا الاسم بالفعل.",
          });
        } else {
          sweetAlertInstance
            .fire({
              icon: "success",
              title: "تمت العملية بنجاح",
              text: "تمت اضافة المخزن بنجاح.",
            })
            .then(() => {
              navigate("/SystemAdmin/Inventory");
            });
        }
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ اثناء تحديث بيانات المخزن.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!inventory) {
    return <Loader />;
  }

  return (
    <EditInventoryPresentation
      inventory={inventory}
      products={products}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default EditInventoryContainer;
