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
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import axios from 'axios';
import propTypes from 'prop-types';
import { styled } from '@mui/styles';
import Page from '../components/Page';
//
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/Iconify';
import WalletMenu from '../sections/@dashboard/wallet/WalletMenu';
import WalletEditForm from '../sections/@dashboard/wallet/WalletEditForm';
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

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/wallet/withdraw-request/admin`;

WalletPage.propTypes = {
  showSnack: propTypes.func,
};

export default function WalletPage(props) {
  const [wallet, setWallet] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [tabIndex, setTabIndex] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const TABLE_HEAD = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'phone', label: 'Số điện thoại', alignRight: false },
    { id: 'amount', label: 'Số lượng', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
    { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  ];

  const CenterBox = styled('div')({
    paddingTop: '3rem',
    paddingBottom: '3rem',
    width: '100%',
    textAlign: 'center',
    borderBottom: '1px solid rgba(241, 243, 244, 1)',
    position: 'absolute',
  });

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
        setTotalRecords(response.data.data.total);
        setWallet(response.data.data);
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


  const ChangeStatus = event => {
    if (event.target.value === 'ALL') {
      axios
        .get(`${apiURL}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        })
        .then(response => {
          setWallet(response.data.data);
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
          setWallet(response.data.data);
        })
        .finally(() => setIsLoadingList(false));
    }
  };

  return (
    <Page title="Quản lý lệnh rút tiền">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <WalletEditForm
            showSnack={props.showSnack}
            wallet={null}
            reloadData={reloadData}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách lệnh rút tiền
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
                <MenuItem value="PENDING">ĐANG CHỜ</MenuItem>
                <MenuItem value="SUCCESS">THÀNH CÔNG</MenuItem>
                <MenuItem value="FAIL">THẤT BẠI</MenuItem>
                <MenuItem value="CANCEL">ĐÃ HỦY</MenuItem>
              </Select>
            </FormControl>
          </Box>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                {wallet.data?.length > 0 && wallet?.data.map(e => (
                  <TableRow hover key={e?.id} tabIndex={-1}>
                    <TableCell align="left">{e?.driver?.fullName}</TableCell>
                    <TableCell align="left">{e?.driver?.phone}</TableCell>
                    <TableCell align="left">{e?.amount}</TableCell>
                    <TableCell align="left">{e?.status}</TableCell>
                    <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                    {/* <TableCell align="right">
                      <WalletMenu showSnack={props.showSnack} walletId={e?.id} reloadData={reloadData} wallet={e} />
                    </TableCell> */}
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
