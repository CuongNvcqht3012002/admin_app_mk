import { useEffect, useState, useMemo, useCallback } from 'react';
// material
import {
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  Modal,
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
import Page from '../components/Page';
//
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/Iconify';
import NotificationMenu from '../sections/@dashboard/notification/NotificationMenu';
import NotificationEditForm from '../sections/@dashboard/notification/NotificationEditForm';
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

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/notification/admin`;

NotificationPage.propTypes = {
  showSnack: propTypes.func,
};

export default function NotificationPage(props) {
  const [notification, setNotification] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const TABLE_HEAD = [
    { id: 'title', label: 'Tên', alignRight: false },
    { id: 'description', label: 'Mô tả ngắn', alignRight: false },
    { id: 'createdAt', label: 'Thời gian', alignRight: false },
  ];

  useEffect(() => {
    reloadData();
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
        setNotification(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  // console.log(premium.data.length);

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
    <Page title="Quản lý thông báo">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <NotificationEditForm
            showSnack={props.showSnack}
            notification={null}
            reloadData={reloadData}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách thông báo
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" onClick={handleOpenFormDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm mới
            </Button>
          </Stack>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                {notification?.data?.map(e => (
                    <TableRow hover key={e?.id} tabIndex={-1}>
                      <TableCell align="left">{e?.title}</TableCell>
                      <TableCell align="left">
                        <p style={{ textDecoration: 'none', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden', padding: 0, width: '200px'}}>{e?.description}</p>
                      </TableCell>
                      <TableCell align="left">{e?.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <NotificationMenu showSnack={props.showSnack} notificationId={e?.id} reloadData={reloadData} notification={e} />
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
