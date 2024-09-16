import React, { useState, useEffect } from "react";
import sweetAlertInstance from "../../../helper/SweetAlert";
import { useNavigate } from "react-router-dom";
import SuppliersTable from "./SuppliersTable";
import { SupplierProps } from "./Suppliers-interfaces";
import { useSuppliersApi } from './useSupplierApi';

const ProductsContainer: React.FC = () => {
  const { getAllSuppliers, deleteSupplier } = useSuppliersApi();
  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState(() => {
    const savedModel = sessionStorage.getItem('paginationModel');
    return savedModel ? JSON.parse(savedModel) : { page: 0, pageSize: 4 };
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
    sessionStorage.setItem('paginationModel', JSON.stringify(paginationModel));
  }, [paginationModel]);



  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await getAllSuppliers(paginationModel.pageSize, paginationModel.page + 1);
      setSuppliers(response.suppliers);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const response = await deleteSupplier(id);
    console.log("Supplier deleted:", response);
    sweetAlertInstance
      .fire({
        icon: "success",
        title: "تمت العملية بنجاح",
        text: "تم مسح المنتج بنجاح.",
      })
      .then(() => {
        window.location.reload();
      });
  };

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    setPaginationModel(newModel);
  };

  const handleEditClick = (data: SupplierProps) => {
    console.log("Edit clicked");
    console.log(data);
    navigate("/SystemAdmin/EditSupplier", { state: { supplier: data } });
  };

  return (
    <SuppliersTable
      suppliers={suppliers}
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

export default ProductsContainer;