// material
import { Box, Grid, Container, Typography, Card } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
// components
import GaugeChart from 'react-gauge-chart';
import Page from '../components/Page';
import {
  TotalUsers,
  BooksMonthly,
  RevenueMonthly,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
const token = JSON.parse(localStorage.getItem('user'));

const apisystemURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/stat`;
export default function DashboardApp() {
  const [userActive, setuserActive] = useState([]);
  const [totalBooks, settotalBooks] = useState([]);
  const [totalRevenue, settotalRevenue] = useState([]);
  const [totalOrder, settotalOrder] = useState([]);
  const [systemInfo, setSystemInfo] = useState({ cpu: 0, mem: 0 });

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    axios
      .get(`${apisystemURL}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setSystemInfo(response.data.data);
      })
      .catch(err => console.log(err));
    setTimeout(() => loadSystemData(), 15000);
  };

  console.log(systemInfo);

  return (
    <Page title="Dashboard | Admin">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Xin chào, Chào mừng bạn trở lại</Typography>
        </Box>
        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Số lượng tài xế</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <TotalUsers systemInfo={systemInfo} />
          </Grid>
        </Grid>
        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Số lượng đơn</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <BooksMonthly systemInfo={systemInfo} />
          </Grid>
        </Grid>

        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Doanh thu</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <RevenueMonthly systemInfo={systemInfo} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}