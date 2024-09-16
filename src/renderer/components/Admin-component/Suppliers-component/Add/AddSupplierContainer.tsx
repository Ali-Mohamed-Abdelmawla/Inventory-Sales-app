// AddProductContainer.tsx
import React, { useState } from "react";
import AddSupplierPresentation from "./AddSupplier";
import { SupplierData } from "../Suppliers-interfaces";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import { useNavigate } from "react-router-dom";
import { useSuppliersApi } from "../useSupplierApi";

const AddProductContainer: React.FC = () => {
  const navigate = useNavigate();
  const { addSupplier } = useSuppliersApi();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: SupplierData) => {
    
    setLoading(true);
    try {
      await addSupplier(data);
      sweetAlertInstance
        .fire({
          icon: "success",
          title: "تمت العملية بنجاح",
          text: "تمت اضافة المورد بنجاح.",
        })
        .then(() => {
          navigate("/SystemAdmin/Supplier");
        });
    } catch (error) {
      console.error("Error creating supplier:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ اثناء اضافة المورد.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddSupplierPresentation
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AddProductContainer;