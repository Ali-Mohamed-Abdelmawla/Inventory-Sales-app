// StatisticsPresentation.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import Loader from "../../../helper/loading-component/loader";
import { StatisticsPresentationProps } from "../../../interfaces/Statistics-interfaces";

const StatisticsPresentation: React.FC<StatisticsPresentationProps> = ({
  salesByDate,
  topSellingProducts,
  dashboardSummary,
  loading,
  error,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4">خطأ: {error}</Typography>
      </Box>
    );
  }

  const chartData = {
    labels: topSellingProducts?.map((product) => product.name),
    datasets: [
      {
        label: "إجمالي الإيرادات",
        data: topSellingProducts?.map((product) => product.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "إجمالي الكمية",
        data: topSellingProducts?.map((product) => product.totalQuantity),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "المنتجات الأكثر مبيعاً",
      },
    },
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        إحصائيات المبيعات
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">إجمالي المنتجات</Typography>
              <Typography variant="h4">
                {dashboardSummary?.totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">إجمالي المبيعات</Typography>
              <Typography variant="h4">
                {dashboardSummary?.totalSales}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">إجمالي الإيرادات</Typography>
              <Typography variant="h4">
                ${dashboardSummary?.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5">المنتجات الأكثر مبيعاً</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="جدول بسيط">
            <TableHead>
              <TableRow>
                <TableCell>اسم المنتج</TableCell>
                <TableCell align="right">إجمالي الكمية</TableCell>
                <TableCell align="right">إجمالي الإيرادات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topSellingProducts.map((product) => (
                <TableRow
                  key={product?.productId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {product?.name}
                  </TableCell>
                  <TableCell align="right">{product?.totalQuantity}</TableCell>
                  <TableCell align="right">
                    ${product?.totalRevenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5">المنتجات ذات المخزون المنخفض</Typography>
        <ul>
          {dashboardSummary?.lowStockProducts.map((product) => (
            <li key={product._id}>
              {product.name} - المخزون الحالي: {product.inventories[0]?.quantity}
            </li>
          ))}
        </ul>
      </Box>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5">الرسم البياني</Typography>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default StatisticsPresentation;