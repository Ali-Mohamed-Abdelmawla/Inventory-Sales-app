import React, { useState } from "react";
import AddInventoryPresentation from "./AddInventory";
import { useInventoriesApi } from "../useInventoriesApi";
import { InventoryData } from "../Inventories-interfaces";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import { useNavigate } from "react-router-dom";
const AddInventoryContainer: React.FC = () => {
  const navigate = useNavigate();
  const { createInventory } = useInventoriesApi();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: InventoryData) => {
    setLoading(true);
    try {
       await createInventory(data).then((response) => {
        console.log("Inventory created:", response);
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
       })

    } catch (error) {
      console.error("Error creating inventory:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ اثناء اضافة المخزن.",
      });
    } finally {
      setLoading(false);
    }
  };

  return <AddInventoryPresentation onSubmit={handleSubmit} loading={loading} />;
};

export default AddInventoryContainer;
