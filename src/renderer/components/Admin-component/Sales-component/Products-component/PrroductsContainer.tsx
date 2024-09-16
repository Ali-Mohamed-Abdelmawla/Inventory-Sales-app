// import React, { useState, useEffect } from "react";
// import { useProductsApi } from "./useProductsApi";
// import sweetAlertInstance from "../../../helper/SweetAlert";
// import { useNavigate } from "react-router-dom";
// import ProductsTable from "./ProductsTable";
// import { ProductsProps } from "./Products-interfaces";

// const ProductsContainer: React.FC = () => {
//   const { getAllProducts, deleteProduct } = useProductsApi();
//   const [products, setProducts] = useState<ProductsProps[]>([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 4,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, [paginationModel]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllProducts(paginationModel.pageSize, paginationModel.page + 1);
//       setProducts(response.products);
//       setTotalPages(response.totalPages);
//       setTotalItems(response.totalItems);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClick = async (id: string) => {
//     const response = await deleteProduct(id);
//     console.log("Product deleted:", response);
//     sweetAlertInstance
//       .fire({
//         icon: "success",
//         title: "تمت العملية بنجاح",
//         text: "تم مسح المنتج بنجاح.",
//       })
//       .then(() => {
//         window.location.reload();
//       });
//   };

//   const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
//     setPaginationModel(newModel);
//   };

//   const handleEditClick = (data: ProductsProps) => {
//     console.log("Edit clicked");
//     console.log(data);
//     navigate("/SystemAdmin/EditInventory", { state: { inventory: data } });
//   };

//   return (
//     <ProductsTable
//       products={products}
//       paginationModel={paginationModel}
//       totalPages={totalPages}
//       totalItems={totalItems}
//       loading={loading}
//       onPaginationModelChange={handlePaginationModelChange}
//       handleEditClick={handleEditClick}
//       handleDeleteClick={handleDeleteClick}
//     />
//   );
// };

// export default ProductsContainer;


import React, { useState, useEffect } from "react";
import { useProductsApi } from "./useProductsApi";
import sweetAlertInstance from "../../../helper/SweetAlert";
import { useNavigate } from "react-router-dom";
import ProductsTable from "./ProductsTable";
import { ProductsProps } from "./Products-interfaces";

const ProductsContainer: React.FC = () => {
  const { getAllProducts, deleteProduct } = useProductsApi();
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState(() => {
    const savedModel = sessionStorage.getItem('paginationModel');
    return savedModel ? JSON.parse(savedModel) : { page: 0, pageSize: 4 };
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    sessionStorage.setItem('paginationModel', JSON.stringify(paginationModel));
  }, [paginationModel]);



  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts(paginationModel.pageSize, paginationModel.page + 1);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const response = await deleteProduct(id);
    console.log("Product deleted:", response);
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

  const handleEditClick = (data: ProductsProps) => {
    console.log("Edit clicked");
    console.log(data);
    navigate("/SystemAdmin/EditProduct", { state: { product: data } });
  };

  return (
    <ProductsTable
      products={products}
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