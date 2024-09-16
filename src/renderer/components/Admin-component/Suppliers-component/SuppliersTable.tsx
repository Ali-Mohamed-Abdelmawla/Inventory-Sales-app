import React from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CustomDataGrid from "../../../helper/Styled-Table/CustomDataGrid";
import {
  SupplierPresentationProps,
  SupplierProps,
} from "./Suppliers-interfaces";
import { Button } from "@mui/material";

const ProductsTable: React.FC<SupplierPresentationProps> = ({
  suppliers,
  paginationModel,
  totalPages,
  totalItems,
  loading,
  onPaginationModelChange,
  handleEditClick,
  handleDeleteClick,
}) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "اسم المورد", flex: 0.5 },
    { field: "contactPerson", headerName: "اسم العميل", flex: 0.5 },
    {
      field: "email",
      headerName: "البريد الالكتروني",
      flex: 0.5,
    },
    { field: "phone", headerName: "رقم الهاتف", flex: 0.5 },
    { field: "address", headerName: "العنوان", flex: 0.5 },
    {
      field: "products",
      headerName: "المنتجات",
      flex: 1,
      renderCell: (params: GridRenderCellParams<SupplierProps>) => (
        <ul style={{ margin: 5, marginTop: 0 }}>
          {params.row.products.map((product) => (
            <li key={product._id} style={{ marginBottom: '4px' }}>
              {/* {`${products.inventory.name} - المخزون الحالي: ${products.quantity}`} */}
              {`${product.name} - سعر المنتج: ${product.price}`}
            </li>
          ))}
        </ul>
        
      ),
    },
    { field: "createdAt", headerName: "تاريخ الاضافه", flex: 1 },
    { field: "updatedAt", headerName: "تاريخ اخر تعديل", flex: 1 },
    {
      field: "Actions",
      headerName: "الاعدادات",
      flex: 1,
      renderCell: (params: GridRenderCellParams<SupplierProps>) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="contained" color="primary" size="small" onClick={() => handleEditClick(params.row)}>
            عرض التفاصيل و تعديل
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => handleDeleteClick(params.row._id)}>
            مسح
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CustomDataGrid
      rows={suppliers}
      columns={columns}
      getRowId={(row) => row._id}
      initialState={{
        pagination: {
          paginationModel: paginationModel,
        },
      }}
      pageSizeOptions={[4, 8, 12]}
      paginationMode="server"
      rowCount={totalItems}
      loading={loading}
      onPaginationModelChange={onPaginationModelChange}

    />
  );
};

export default ProductsTable;