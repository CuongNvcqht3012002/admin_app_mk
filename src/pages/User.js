import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  LinearProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { styled } from '@mui/styles';
// components
import { debounce } from 'lodash';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserMoreMenu } from '../sections/@dashboard/user';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'gender', label: 'Giới tính', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'phone', label: 'Số điện thoại', alignRight: false },
  { id: 'createdAT', label: 'Thời gian tạo', alignRight: false },
];

const CenterBox = styled('div')({
  paddingTop: '3rem',
  paddingBottom: '3rem',
  width: '100%',
  textAlign: 'center',
  borderBottom: '1px solid rgba(241, 243, 244, 1)',
  position: 'absolute',
});

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/user`;

export default function User() {
  const [user, setUser] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}?page=${page}&pageSize=${rowsPerPage}&name=${kw || ''}`, {
        mode: 'no-cors',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setUser(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  // console.log(user);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);
  //  ================================

  return (
    <Page title="Quản lý người dùng">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách người dùng
          </Typography>
        </Stack>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody sx={{ position: 'relative', height: '7.85rem' }}>
                  {user?.data?.length > 0 ? (
                    user?.data?.map(e => (
                      <TableRow hover key={e?.id} tabIndex={-1}>
                        <TableCell align="left">{e?.fullName}</TableCell>
                        <TableCell align="left">{e?.email}</TableCell>
                        <TableCell align="left">{e?.gender === "MALE" ? "NAM" : "NỮ"}</TableCell>
                        <TableCell align="left">
                          <p style={{ textDecoration: 'none',webkitLineClamp: 1,webkitBoxOrient: 'vertical',display: '-webkit-box',overflow: 'hidden',padding: 0, width: '200px' }}>{e?.address}</p>
                        </TableCell>
                        <TableCell align="left">{e?.phone}</TableCell>
                        <TableCell align="left">{e?.createdAt.substr(0, 10)}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu
                            IdUser={e?.id}
                            name={e?.name}
                            email={e?.email}
                            isActivated={e?.isActivated}
                            reloadData={reloadData}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <CenterBox>Không có kết quả tìm kiếm nào phù hợp</CenterBox>
                  )}
                </TableBody>
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
