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
import PostMenu from '../sections/@dashboard/post/PostMenu';
import PostEditForm from '../sections/@dashboard/post/PostEditForm';
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

const apiURL = `${process.env.REACT_APP_SERVICE_BASE_URL}/post/admin`;

PostPage.propTypes = {
  showSnack: propTypes.func,
};

export default function PostPage(props) {
  const [post, setPost] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const TABLE_HEAD = [
    { id: 'thumbnailUrl', label: 'Ảnh minh họa', alignRight: false },
    { id: 'title', label: 'Tiêu đề', alignRight: false },
    { id: 'content', label: 'Mô tả ngắn', alignRight: false },
    { id: 'isActive', label: 'Trạng thái bài viết', alignRight: false },
    { id: 'isHomeActive', label: 'Trạng thái hiển thị trang chủ', alignRight: false },
    { id: 'createdAt', label: 'Ngày đăng', alignRight: false },
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
        setPost(response.data.data);
      })
      .finally(() => setIsLoadingList(false));
  };

  // console.log(post.data.length);

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
    <Page title="Quản lý tin tức">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <PostEditForm
            showSnack={props.showSnack}
            post={null}
            reloadData={reloadData}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách tin tức
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
                {post?.data?.map(e => (
                    <TableRow hover key={e?.id} tabIndex={-1}>
                      <TableCell align="left">
                          <img src={e?.thumbnailUrl} alt="" style={{ maxHeight: '125px', maxWidth: '300px' }} />
                      </TableCell>
                      <TableCell align="left">{e?.title}</TableCell>
                      <TableCell align="left">
                        <TableCell style={{ textDecoration: 'none', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden', padding: 0, width: '200px'}} dangerouslySetInnerHTML={{ __html: e?.content }} />
                      </TableCell>
                      <TableCell align="left">{e?.isActive === true ? "Active" : "Disabled"}</TableCell>
                      <TableCell align="left">{e?.isHomeActive === true ? "Active" : "Disabled"}</TableCell>
                      <TableCell align="left">{e?.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <PostMenu showSnack={props.showSnack} postId={e?.id} reloadData={reloadData} post={e} />
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
