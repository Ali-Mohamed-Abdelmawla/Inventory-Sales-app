// StatisticsContainer.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import StatisticsPresentation from "./Statistics";
import {
  SalesByDate,
  TopSellingProduct,
  DashboardSummary,
} from "../../../interfaces/Statistics-interfaces";
import axiosInstance from "../../../auth/axios";

const StatisticsContainer: React.FC = () => {
  const [salesByDate, setSalesByDate] = useState<SalesByDate[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<
    TopSellingProduct[]
  >([]);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // const [salesResponse, productsResponse, summaryResponse] = await Promise.all([
        //   axios.get(`http://localhost:5000/api/reports/salesByDate?startDate=${yesterday.toISOString()}&endDate=${today.toISOString()}`),
        //   axios.get('http://localhost:5000/api/reports/topSellingProducts'),
        //   axios.get('http://localhost:5000/api/dashboard/summary'),
        // ]);
        const [salesResponse, productsResponse, summaryResponse] =
          await Promise.all([
            axiosInstance.get(
              `reports/salesByDate`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "Application/json",
                },
                params: {
                    startDate:'2024-08-19T15:39:29.777Z', 
                    endDate:'2024-08-20T15:39:29.777Z'
                },
              }
            ),
            axiosInstance.get("reports/topSellingProducts", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "Application/json",
              },
            }),
            axiosInstance.get("dashboard/summary", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "Application/json",
              },
            }),
          ]);

        setSalesByDate(salesResponse.data);
        setTopSellingProducts(productsResponse.data);
        setDashboardSummary(summaryResponse.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <StatisticsPresentation
      salesByDate={salesByDate}
      topSellingProducts={topSellingProducts}
      dashboardSummary={dashboardSummary}
      loading={loading}
      error={error}
    />
  );
};

export default StatisticsContainer;
