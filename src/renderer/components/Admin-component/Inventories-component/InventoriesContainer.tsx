import React, { useState, useEffect } from "react";
import { useInventoriesApi } from "./useInventoriesApi";
import sweetAlertInstance from "../../../helper/SweetAlert";
import { useNavigate } from "react-router-dom";
import InventoriesTable from "./InventoriesTable";
import { InventoryProps } from "./Inventories-interfaces";

const InventoryContainer: React.FC = () => {
  const { getAllInventories, deleteInventory } = useInventoriesApi();
  const [inventories, setInventories] = useState<InventoryProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState(() => {
    const savedModel = sessionStorage.getItem('paginationModel')
    return savedModel ? JSON.parse(savedModel) : { page: 0, pageSize: 4 }
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventories();
    sessionStorage.setItem('paginationModel', JSON.stringify(paginationModel));
  }, [paginationModel]);

  const fetchInventories = async () => {
    setLoading(true);
    try {
      const response = await getAllInventories(paginationModel.pageSize, paginationModel.page + 1);
      setInventories(response.inventories);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const response = await deleteInventory(id);
    console.log("Inventory deleted:", response);
    sweetAlertInstance
      .fire({
        icon: "success",
        title: "تمت العملية بنجاح",
        text: "تم مسح المخزن بنجاح.",
      })
      .then(() => {
        window.location.reload();
      });
  };

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    setPaginationModel(newModel);
  };

  const handleEditClick = (data: InventoryProps) => {
    console.log("Edit clicked");
    console.log(data);
    navigate("/SystemAdmin/EditInventory", { state: { inventory: data } });
  };

  return (
    <InventoriesTable
      inventories={inventories}
      paginationModel={paginationModel}
      totalPages={totalPages}
      totalItems={totalItems}
      loading={loading}
      onPaginationModelChange={handlePaginationModelChange}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
    />
  );
};

export default InventoryContainer;