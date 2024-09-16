// EditSupplierContainer.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditSupplierPresentation from "./EditSupplier";
import { useSuppliersApi } from "../useSupplierApi";
import { SupplierProps, SupplierData } from "../Suppliers-interfaces";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import Loader from "../../../../helper/loading-component/loader";

const EditSupplierContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [supplier,setSupplier] = useState<SupplierProps | null>(null);
  const { editSupplier } = useSuppliersApi();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(location);
    if (location.state?.supplier) {
      setSupplier(location.state.supplier);
    }
  }, [location.state]);


  const handleSubmit = async (data: SupplierData) => {
    if (!supplier) return;
    setLoading(true);
    try {
      await editSupplier(supplier._id, data);
      sweetAlertInstance
        .fire({
          icon: "success",
          title: "تمت العملية بنجاح",
          text: "تم تعديل بيانات المورد بنجاح.",
        })
        .then(() => {
          navigate("/SystemAdmin/Supplier");
        });
    } catch (error) {
      console.error("Error updating supplier:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ اثناء تعديل المورد.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!supplier) {
    console.error("Supplier not found");
    return <Loader />;
  }

  return (
    <EditSupplierPresentation
      supplier={supplier}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default EditSupplierContainer;