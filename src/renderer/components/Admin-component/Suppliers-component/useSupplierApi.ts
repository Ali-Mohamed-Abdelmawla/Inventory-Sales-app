import axiosInstance from "../../../auth/axios";
import { SupplierData, SupplierProps } from "./Suppliers-interfaces";
export const useSuppliersApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAllSuppliers = async (pageSize: number, page: number) => {
    return axiosInstance
      .get(`/suppliers/getAllSuppliers?limit=${pageSize}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //============================================================================================

  const addSupplier = async (data: SupplierData) => {
    console.log(data);
    return axiosInstance
      .post("/suppliers/addSupplier", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //============================================================================================

  const deleteSupplier = async (id: string) => {
    return axiosInstance
      .delete(`/suppliers/deleteSupplier`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          id: id,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //===================================================================================================

  const editSupplier = async (id: string, data: SupplierData) => {
    return axiosInstance
      .patch(`/suppliers/updateSupplier`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          id: id,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //===================================================================================================

  const searchSuppliers = async (searchTerm: string) => {
    return axiosInstance
      .get("/suppliers/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: { query: searchTerm },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //===================================================================================================

  return {
    getAllSuppliers,
    addSupplier,
    deleteSupplier,
    editSupplier,
    searchSuppliers,
  };
};
