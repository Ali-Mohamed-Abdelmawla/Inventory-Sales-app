import {
  InventoryProps,
  ProductInventory,
} from "../Inventories-component/Inventories-interfaces";
import { SupplierProps } from "../Suppliers-component/Suppliers-interfaces";
export interface ProductsData {
  _id?: string;
  name: string;
  price: number;
  supplier: SupplierProps;
  supplierId: string;
  inventories: ProductInventory[];
}

export interface ProductsProps extends ProductsData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsPresentationProps {
  products: ProductsProps[];
  paginationModel: { page: number; pageSize: number };
  totalPages: number;
  totalItems: number;
  loading: boolean;
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  handleEditClick: (data: ProductsProps) => void;
  handleDeleteClick: (id: string) => void;
}

export interface AddProductsPresentationProps {
  onSubmit: (data: ProductsData) => Promise<void>;
  loading: boolean;
  suppliers: SupplierProps[];
  inventories: InventoryProps[];
  onSupplierSearch: (value: string) => void;
  onInventoriesSearch: (value: string) => void;
}

export interface EditProductsPresentationProps
  extends AddProductsPresentationProps {
  product: ProductsProps;
}

// export interface SuppliersData {
//   name: string;
//   contactPerson: string;
//   email: string;
//   phone: string;
//   address: string;
//   products: string[];
// }

// export interface SuppliersProps extends SuppliersData {
//   _id: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
