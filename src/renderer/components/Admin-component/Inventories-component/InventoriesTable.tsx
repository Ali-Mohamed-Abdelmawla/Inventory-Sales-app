import React from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CustomDataGrid from "../../../helper/Styled-Table/CustomDataGrid";
import {
  InventoryPresentationProps,
  InventoryProps,
} from "./Inventories-interfaces";
import { Button } from "@mui/material";

const InventoriesTable: React.FC<InventoryPresentationProps> = ({
  inventories,
  paginationModel,
  totalPages,
  totalItems,
  loading,
  onPaginationModelChange,
  handleEditClick,
  handleDeleteClick,
}) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "اسم المخزن", flex: 1 },
    { field: "createdAt", headerName: "تاريخ الاضافه", flex: 1 },
    { field: "updatedAt", headerName: "تاريخ اخر تعديل", flex: 1 },
    {
      field: "Actions",
      headerName: "الاعدادات",
      flex: 1,
      renderCell: (params: GridRenderCellParams<InventoryProps>) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            {" "}
            عرض التفاصيل و تعديل
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDeleteClick(params.row._id)}
          >
            {" "}
            مسح
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CustomDataGrid
      rows={inventories}
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

export default InventoriesTable;
