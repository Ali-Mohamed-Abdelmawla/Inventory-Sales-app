export interface ProductInventory {
  inventory: { _id: string; } | string;
  quantity: number;
}
export interface InventoryData {
  name: string;
}

export interface InventoryProps extends InventoryData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryPresentationProps {
  inventories: InventoryProps[];
  paginationModel: { page: number; pageSize: number };
  totalPages: number;
  totalItems: number;
  loading: boolean;
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  handleEditClick: (data: InventoryProps) => void;
  handleDeleteClick: (id: string) => void;
}

export interface AddInventoryPresentationProps {
  onSubmit: (data: InventoryData) => Promise<void>;
  loading: boolean;
}
