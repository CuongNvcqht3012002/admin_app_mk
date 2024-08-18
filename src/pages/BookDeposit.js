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
import BookDepositMenu from '../sections/@dashboard/bookingDeposit/BookingDepositMenu';
import BookDepositEditForm from '../sections/@dashboard/bookingDeposit/BookingDepositEditForm';
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

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/booking-deposit/admin`;

BookDepositPage.propTypes = {
  showSnack: propTypes.func,
};

export default function BookDepositPage(props) {
  const [bookDeposit, setBookDeposit] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const TABLE_HEAD = [
    { id: 'fullName', label: 'Tên', alignRight: false },
    { id: 'phone', label: 'Số điện thoại', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
    { id: 'amount', label: 'Số lượng', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
  ];

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}`, {
        mode: 'no-cors',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        // setTotalRecords(response.data.data.total);
        setBookDeposit(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  const ChangeStatus = event => {
    if (event.target.value === 'ALL') {
      axios
        .get(`${apiURL}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        })
        .then(response => {
          setBookDeposit(response.data.data);
        })
        .finally(() => setIsLoadingList(false));
    } else {
      axios
        .get(`${apiURL}`, {
          params: {
            status: event.target.value,
          },
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        })
        .then(response => {
          setBookDeposit(response.data.data);
        })
        .finally(() => setIsLoadingList(false));
    }
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
    <Page title="Quản lý đơn đặt cọc">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <BookDepositEditForm
            showSnack={props.showSnack}
            bookDeposit={null}
            reloadData={reloadData}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách đơn đặt cọc
          </Typography>
          {/* <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" onClick={handleOpenFormDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm mới
            </Button>
          </Stack> */}
        </Stack>
        <Box sx={{ marginBottom: '10px', textAlign: 'end' }}>
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
                <MenuItem value="PENDING_TRANSFER">Chờ vận chuyển</MenuItem>
                <MenuItem value="PENDING_REVIEW">Chờ duyệt</MenuItem>
                <MenuItem value="SUCCESS">Thành công</MenuItem>
                <MenuItem value="FAIL">Thất bại</MenuItem>
                <MenuItem value="CANCEL">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                {bookDeposit?.data?.map(e => (
                  <TableRow hover key={e?.id} tabIndex={-1}>
                    <TableCell align="left">{e?.booking?.user?.fullName}</TableCell>
                    <TableCell align="left">{e?.booking?.user?.phone}</TableCell>
                    <TableCell align="left">{e?.booking?.user?.email}</TableCell>
                    <TableCell align="left">{e?.description}</TableCell>
                    <TableCell align="left">{e?.amount}</TableCell>
                    <TableCell align="left">
                      {e?.status === "SUCCESS" && "Thành công"}
                      {e?.status === "PENDING_TRANSFER" && "Chờ vận chuyển"}
                      {e?.status === "PENDING_PREVIEW" && "Chờ duyệt"}
                      {e?.status === "FAIL" && "Thất bại"}
                      {e?.status === "CANCEL" && "Đã hủy"}
                    </TableCell>
                    <TableCell align="right">
                      <BookDepositMenu
                        showSnack={props.showSnack}
                        bookDepositId={e?.id}
                        reloadData={reloadData}
                        bookDeposit={e}
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
