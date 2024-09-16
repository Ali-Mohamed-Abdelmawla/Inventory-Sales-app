import { ProductsData } from "../Products-component/Products-interfaces";

export interface SupplierData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: ProductsData[];
  }
  
  export interface SupplierProps extends SupplierData {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface SupplierPresentationProps {
    suppliers: SupplierProps[];
    paginationModel: { page: number; pageSize: number };
    totalPages: number;
    totalItems: number;
    loading: boolean;
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
    handleEditClick: (data: SupplierProps) => void;
    handleDeleteClick: (id: string) => void;
  }
  
  export interface AddSupplierPresentationProps {
    onSubmit: (data: SupplierData) => Promise<void>;
    loading: boolean;
  }
  
  export interface EditSuppliersPresentationProps {
    supplier: SupplierProps;
    onSubmit: (data: SupplierData) => Promise<void>;
    loading: boolean;
  }