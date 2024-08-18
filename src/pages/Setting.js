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
import { styled } from '@mui/styles';
import Page from '../components/Page';
//
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/Iconify';
import SettingMenu from '../sections/@dashboard/setting/SettingMenu';
import SettingEditForm from '../sections/@dashboard/setting/SettingEditForm';
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

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/setting`;

SettingPage.propTypes = {
  showSnack: propTypes.func,
};

export default function SettingPage(props) {
  const [setting, setSetting] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const TABLE_HEAD = [
    { id: 'registrationImageUrl', label: 'Ảnh', alignRight: false },
    { id: 'registrationTitle', label: 'Tiêu đề', alignRight: false },
    { id: 'registrationDescription', label: 'Mô tả', alignRight: false },
  ];

  const TABLE_HEAD_HOTLINE = [
    { id: 'hotline', label: 'Số điện thoại liên hệ khẩn cấp', alignRight: false },
  ];

  const TABLE_HEAD_BANK = [
    { id: 'bankName', label: 'Tên ngân hàng', alignRight: false },
    { id: 'bankAccountNumber', label: 'Số tài khoản', alignRight: false },
    { id: 'bankAccountOwner', label: 'Chủ tài khoản', alignRight: false },
    { id: 'bankTransferNotice', label: 'Nội dung tài khoản', alignRight: false },
  ];
  const TABLE_HEAD_SUPORT = [
    { id: 'termsAndPolicy', label: 'Điều khoản và chính sách', alignRight: false },
    { id: 'support', label: 'Hỗ trợ', alignRight: false },
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
        setSetting(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  // console.log(setting.data);

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
    <Page title="Quản lý thông tin app">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <SettingEditForm
            showSnack={props.showSnack}
            setting={setting}
            reloadData={reloadData}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography mt={2} variant="h4" gutterBottom>
            Thông tin giới thiệu app
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" onClick={handleOpenFormDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
                Chỉnh sửa
              </Button>
            </Stack>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                  <TableRow hover key={setting?.id} tabIndex={-1}>
                    <TableCell align="left">
                      <img src={setting?.registrationImageUrl} alt="" style={{ maxHeight: '125px', maxWidth: '300px' }} />
                    </TableCell>
                    <TableCell align="left">{setting?.registrationTitle}</TableCell>
                    <TableCell align="left">{setting?.registrationDescription}</TableCell>
                  </TableRow>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography mt={2} variant="h4" gutterBottom>
            Điều khoản chính sách và hỗ trợ
          </Typography>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD_SUPORT} />
                  <TableRow hover key={setting?.id} tabIndex={-1}>
                    <TableCell align="left">
                      <TableCell style={{ textDecoration: 'none', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden', padding: 0, width: '200px'}}>{setting?.termsAndPolicy}</TableCell>
                    </TableCell>
                    <TableCell align="left">
                      <TableCell style={{ textDecoration: 'none', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden', padding: 0, width: '200px'}}>{setting?.support}</TableCell>
                    </TableCell>
                  </TableRow>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography mt={2} variant="h4" gutterBottom>
            Hotline
          </Typography>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD_HOTLINE} />
                  <TableRow hover key={setting?.id} tabIndex={-1}>
                    <TableCell align="left">{setting?.hotline}</TableCell>
                  </TableRow>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography mt={2} variant="h4" gutterBottom>
            Thông tin ngân hàng
          </Typography>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD_BANK} />
                  <TableRow hover key={setting?.id} tabIndex={-1}>
                    <TableCell align="left">{setting?.bankName}</TableCell>
                    <TableCell align="left">{setting?.bankAccountNumber}</TableCell>
                    <TableCell align="left">{setting?.bankAccountOwner}</TableCell>
                    <TableCell align="left">{setting?.bankTransferNotice}</TableCell>
                  </TableRow>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
