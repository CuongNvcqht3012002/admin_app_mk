import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Button,
  Snackbar,
  LinearProgress,
  Modal,
  Box,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import BannerMoreMenu from '../sections/@dashboard/banner/BannerMenu';
import BannerEditForm from '../sections/@dashboard/banner/BannerEditForm';

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

// console.log(token);

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/banner/admin`;

export default function OrderPage() {
  const [banner, setBanner] = useState([]);
  const [tabIndex, setTabIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const TABLE_HEAD = [
    { id: 'imageUrl', label: 'Hình ảnh', alignRight: false },
    { id: 'url', label: 'Đường dẫn', alignRight: false },
    { id: 'isActive', label: 'Trạng thái', alignRight: false },
  ];

  const handleClose = () => setOpen(false);

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setBanner(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  const handleTab = tab => {
    setTabIndex(tab);
  };

  return (
    <Page title="Quản lý Banner">
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        message="Gửi yêu cầu thành công!"
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        message="Cập nhật thành công!"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <BannerEditForm banner={null} closeModal={handleClose} reloadData={reloadData} />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách Banner
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm mới
          </Button>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                  <TableBody>
                    {banner.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(e => (
                      <TableRow hover key={e._id} tabIndex={-1}>
                        <TableCell align="left">
                          <img src={e.imageUrl} alt="" style={{ maxHeight: '125px', maxWidth: '300px' }} />
                        </TableCell>
                        <TableCell align="left">{e.url}</TableCell>
                        <TableCell align="left">{e.isActive === true ? "Active" : "Disabled"}</TableCell>
                        <TableCell align="right">
                          <BannerMoreMenu banner={e} reloadData={reloadData} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          {/* <ThemeProvider theme={themeWithLocale}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={banner.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </ThemeProvider> */}
        </Card>
      </Container>
    </Page>
  );
}
