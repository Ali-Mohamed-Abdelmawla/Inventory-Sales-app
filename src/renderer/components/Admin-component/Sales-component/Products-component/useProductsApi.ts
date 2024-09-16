import axiosInstance from "../../../auth/axios";
import { ProductsData } from "./Products-interfaces";
export const useProductsApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAllProducts = async (pageSize: number, page: number) => {
    return axiosInstance
      .get(`/products/getAllProducts?limit=${pageSize}&page=${page}`, {
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

  const addProduct = async (data: ProductsData) => {
    console.log(data);
    return axiosInstance
      .post(
        "/products/addProduct",
        {
          name: data.name,
          price: data.price,
          supplierId: data.supplierId,
          inventories: data.inventories,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //============================================================================================

  const deleteProduct = async (id: string) => {
    return axiosInstance
      .delete(`/products/deleteProduct`, {
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

  const editProduct = async (id: string, data: ProductsData) => {
    console.log(data);
    return axiosInstance
      .patch(`/products/updateProduct`, data, {
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

  return {
    getAllProducts,
    addProduct,
    deleteProduct,
    editProduct,
  };
};
