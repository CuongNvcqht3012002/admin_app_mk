import { useRef, useState } from 'react';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Box,
  Snackbar,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogActions,
  Button,
} from '@mui/material';
// component
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
  marginTop: '10px',
};

// ----------------------------------------------------------------------
ListQuoteMenu.propTypes = {
  ListQuote: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function ListQuoteMenu(props) {
  const { ListQuote, reloadData } = props;
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [detail, setIsDetail] = useState(false);
  const [quote, setQuote] = useState('');
  const [existDialogOpen, setexistDialogOpen] = useState(false);

  const handleOpenEditDialog = () => {
    setIsDialogOpen(true);
    setIsMenuOpen(false);
  };
  const handleOpenDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setIsMenuOpen(false);
    setIsDialogOpen(false);
  };
  // ============== Snackbar Delete ==============
  const [successDialogOpen, setsuccessDialogOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setsuccessDialogOpen(false);
    setexistDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_SERVICE_BASE_URL}/booking/${ListQuote.id}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(() => {
        handleCloseDeleteDialog();
        reloadData();
        handleSnackEditSuccess();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  const handleSnackEditSuccess = () => {
    setsuccessDialogOpen(true);
  };

  const handleDetail = () => {
    setIsMenuOpen(false);
    setIsDetail(true);
    axios
      .get(`${process.env.REACT_APP_SERVICE_BASE_URL}/booking-quote/admin/detail/${ListQuote.id}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setQuote(response.data.data);
      });
  };

  const handleSnackExistSuccess = () => {
    setexistDialogOpen(true);
  };

  const handleAccept = () => {
    axios
      .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/booking-quote/admin-accept/${ListQuote.id}`, null, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(() => {
        reloadData();
        handleSnackEditSuccess();
      })
      .catch(error => {
        handleSnackExistSuccess();
      })
      .finally(() => {
        // setsuccessDialogOpen(false);
        // setexistDialogOpen(false);
      });
  };

  // console.log(quote);

  const handleCloseDetail = () => {
    setIsMenuOpen(false);
    setIsDetail(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Xác nhận thành công!"
        // action={action}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={existDialogOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Yêu cầu đã được xác nhận!"
        // action={action}
      />
      <IconButton ref={ref} onClick={() => setIsMenuOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
      <Modal
        open={detail}
        onClose={handleCloseDetail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>Chi tiết báo giá</h1>
          <Box>
            <p style={{ paddingRight: '10px', fontSize: '18px' }}>Hình ảnh</p>
            <img style={{ width: '100px' }} src={quote?.driver?.avatarUrl} alt="" />
          </Box>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Địa chỉ tài xế: <span style={{ textTransform: 'uppercase' }}>{quote?.driver?.address}</span>
          </p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Tên phương tiện: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.vehicleCategory}</span>
          </p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Điểm đi: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.from}</span>
          </p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Điểm đến: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.to}</span>
          </p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Ghi chú: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.note}</span>
          </p>
          {/* <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Trạng thái: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.status}</span></p> */}
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Bắt đầu: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.startAt.substr(0, 10)}</span>
          </p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">
            Kết thúc: <span style={{ textTransform: 'uppercase' }}>{quote?.booking?.endAt.substr(0, 10)}</span>
          </p>
        </Box>
      </Modal>
      <Menu
        open={isMenuOpen}
        anchorEl={ref.current}
        onClose={() => {
          setIsDialogOpen(false);
          setIsMenuOpen(false);
        }}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDetail}>
          <ListItemIcon sx={{ marginRight: 0 }}>
            <Iconify icon="tabler:edit" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Chi tiết báo giá" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {/* <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
        <MenuItem onClick={handleAccept} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xác nhận báo giá" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
