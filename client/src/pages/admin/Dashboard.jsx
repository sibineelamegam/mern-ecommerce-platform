import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { dashboardStyles } from "../../styles/dashboard";
import { getDashboardStats } from "../../api/dashboardApi";
import Spinner from "../../components/common/Spinner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    products: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { title: "Total Users", value: stats.users },
    { title: "Total Categories", value: stats.categories },
    { title: "Total Products", value: stats.products },
    { title: "Total Orders", value: stats.orders }, 
  ];

  return (
    <Box p={3}>
      <Typography variant="h6" py={4}>
        Admin Dashboard
      </Typography>

      <Box sx={dashboardStyles.container}>
        {cards.map((stat) => (
          <Paper key={stat.title} elevation={3} sx={dashboardStyles.card}>
            <Typography variant="h6">{stat.title}</Typography>
            <Typography variant="h4">{stat.value}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
