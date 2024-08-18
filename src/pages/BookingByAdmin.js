import { useEffect, useState, useMemo, useCallback } from 'react';
// material
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import axios from 'axios';
import { debounce } from 'lodash';
import propTypes from 'prop-types';
import { styled } from '@mui/styles';
import Page from '../components/Page';
//
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/Iconify';
import BookingByAdminMenu from '../sections/@dashboard/bookingByAdmin/BookingByAdminMenu';
import BookingByAdminEditForm from '../sections/@dashboard/bookingByAdmin/BookingByAdminEditForm';
import filterIcon from '../assets/icons/filterIcon.svg';
import '../assets/css/new.css';

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/booking/admin/by-admin`;

BookingByAdminPage.propTypes = {
  showSnack: propTypes.func,
};

export default function BookingByAdminPage(props) {
  const [region, setRegion] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [bookingByAdmin, setBookingByAdmin] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const TABLE_HEAD = [
    { id: 'vehicleCategory', label: 'Loại xe', alignRight: false },
    { id: 'from', label: 'Điểm đi', alignRight: false },
    { id: 'to', label: 'Điểm đến', alignRight: false },
    { id: 'note', label: 'Ghi chú', alignRight: false },
    { id: 'regionId', label: 'Khu vực', alignRight: false },
    { id: 'startAt', label: 'Bắt đầu', alignRight: false },
    { id: 'endAt', label: 'Kết thúc', alignRight: false },
  ];

  useEffect(() => {
    reloadData();
    reloadRegion();
    reloadVehicle();
  }, [page, rowsPerPage]);

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}?page=${page}&pageSize=${rowsPerPage}`, {
        mode: 'no-cors',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setBookingByAdmin(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  const reloadRegion = () => {
    setIsLoadingList(true);
    axios
      .get(`${process.env.REACT_APP_SERVICE_BASE_URL}/region?page=1&pageSize=9999`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setRegion(response.data.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  const reloadVehicle = () => {
    setIsLoadingList(true);
    axios
      .get(`${process.env.REACT_APP_SERVICE_BASE_URL}/vehicle-category`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setVehicle(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const [open, setOpen] = useState(false);
  const handleOpenFormDialog = () => {
    setOpen(true);
  };
  const handleCloseFormDialog = () => {
    setOpen(false);
  };

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  return (
    <Page title="Quản lý đơn admin">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <BookingByAdminEditForm
            showSnack={props.showSnack}
            regions={region}
            vehicles={vehicle}
            bookingByAdmin={null}
            reloadData={reloadData}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách đơn admin
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" onClick={handleOpenFormDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm mới
            </Button>
          </Stack>
        </Stack>
        {/* <Box sx={{ marginBottom: '10px', textAlign: 'end' }}>
          <FormControl sx={{ width: '200px' }}>
            <InputLabel id="demo-simple-select-label">Lọc trạng thái</InputLabel>
            <Select
              onChange={ChangeStatus}
              // value={status}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  span: {
                    fontSize: '40px',
                  },
                },
              }}
            >
              <MenuItem value="ALL">TẤT CẢ</MenuItem>
              <MenuItem value="PROCESSING">ĐANG XỬ LÝ</MenuItem>
              <MenuItem value="DONE">HOÀN THÀNH</MenuItem>
              <MenuItem value="PENDING">ĐANG CHỜ</MenuItem>
              <MenuItem value="CANCEL">ĐÃ HỦY</MenuItem>
            </Select>
          </FormControl>
        </Box> */}
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                {bookingByAdmin?.data?.map(e => (
                  <TableRow hover key={e?.id} tabIndex={-1}>
                    <TableCell align="left">{e?.vehicleCategory}</TableCell>
                    <TableCell align="left">{e?.from}</TableCell>
                    <TableCell align="left">{e?.to}</TableCell>
                    <TableCell align="left">{e?.note}</TableCell>
                    <TableCell align="left">{e?.region?.name}</TableCell>
                    <TableCell align="left">{e?.startAt?.substr(0, 10)}</TableCell>
                    <TableCell align="left">{e?.endAt?.substr(0, 10)}</TableCell>
                    <TableCell align="right">
                      <BookingByAdminMenu
                        regions={region}
                        vehicles={vehicle}
                        showSnack={props.showSnack}
                        bookingByAdminId={e?.id}
                        reloadData={reloadData}
                        bookingByAdmin={e}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </TableContainer>
          </Scrollbar>
          <ThemeProvider theme={themeWithLocale}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
        </Card>
      </Container>
    </Page>
  );
}
