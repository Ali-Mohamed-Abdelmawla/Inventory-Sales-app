export interface SalesByDate {
  _id: string;
  totalSales: number;
  count: number;
}

export interface TopSellingProduct {
  totalQuantity: number;
  productId: string;
  name: string;
  price: number;
  totalRevenue: number;
}

export interface DashboardSummary {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  lowStockProducts: {
    _id: string;
    name: string;
    price: number;
    supplier: string;
    inventories: {
      inventory: string;
      quantity: number;
      _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}

export interface StatisticsPresentationProps {
  salesByDate: SalesByDate[];
  topSellingProducts: TopSellingProduct[];
  dashboardSummary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}
