import axiosInstance from "../../../auth/axios";
import { InventoryProps } from "./Inventories-interfaces";

export const useInventoriesApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAllInventories = async (pageSize: number, page: number) => {
    return axiosInstance
      .get(`/inventory/getAllInventories?limit=${pageSize}&page=${page}`, {
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

  const createInventory = async (data: { name: string }) => {
    console.log(data);
    return axiosInstance
      .post(
        "/inventory/createInventory",
        {
          name: data.name,
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

  const deleteInventory = async (id: string) => {
    return axiosInstance
      .delete(`/inventory/deleteInventory`, {
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

  const editInventory = async (id: string, data: { name: string }) => {
    return axiosInstance
      .patch(
        `/inventory/updateInventory`,
        {
          name: data.name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            id: id,
          }
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  //===================================================================================================

  const getProductsByInventory = async (id: string) => {
    return axiosInstance.get("/inventory/getProductsByInventory", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        id: id,
      },
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      return error;
    })
  };

    //===================================================================================================

  const searchInventories = async (query: string) => {
    return axiosInstance.get("/inventory/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        query: query,
      }
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      return error;
    })
  }

  return {
    getAllInventories,
    createInventory,
    deleteInventory,
    editInventory,
    getProductsByInventory,
    searchInventories
  };
};
