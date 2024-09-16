import React from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CustomDataGrid from "../../../helper/Styled-Table/CustomDataGrid";
import {
  ProductsPresentationProps,
  ProductsProps,
} from "./Products-interfaces";
import { Button } from "@mui/material";

const ProductsTable: React.FC<ProductsPresentationProps> = ({
  products,
  paginationModel,
  totalPages,
  totalItems,
  loading,
  onPaginationModelChange,
  handleEditClick,
  handleDeleteClick,
}) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "اسم المنتج", flex: 1 },
    { field: "price", headerName: "السعر", flex: 0.5 },
    {
      field: "supplier",
      headerName: "اسم المورد",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<ProductsProps>) => (
        <span>{params.row.supplier.name}</span>
      ),
    },
    {
      field: "inventories",
      headerName: "المخازن المتوفر بها المنتج",
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProductsProps>) => (
        <ul style={{ margin: 5, marginTop: 0 }}>
          {params.row.inventories.map((inventory) => (
            <li key={inventory._id} style={{ marginBottom: '4px' }}>
              {`${inventory.inventory.name} - المخزون الحالي: ${inventory.quantity}`}
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
      renderCell: (params: GridRenderCellParams<ProductsProps>) => (
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
      rows={products}
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