import { useRef, useState } from 'react';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Modal, Box, Snackbar, DialogContent, DialogContentText, Dialog, DialogActions, Button } from '@mui/material';
// component
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import BookingEditForm from './BookingEditForm';

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
  marginTop: '10px'
};

// ----------------------------------------------------------------------
BookingMenu.propTypes = {
  booking: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function BookingMenu(props) {
  const { booking, reloadData } = props;
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [detail, setIsDetail] = useState(false);
  const [detailId, setDetailId] = useState('');

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
  };

  const handleCloseDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_SERVICE_BASE_URL}/booking/${booking.id}`, {
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
      .get(`${process.env.REACT_APP_SERVICE_BASE_URL}/booking/${booking.id}/admin`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setDetailId(response.data.data);
      });
  };

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
        autoHideDuration={8000}
        onClose={handleClose}
        message="Xoá thành công!"

        // action={action}
      />
      <IconButton ref={ref} onClick={() => setIsMenuOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
      <div>
        <Dialog
          open={isDeleteDialogOpen}
          keepMounted
          onClose={handleCloseDeleteDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">Bạn có chắc muốn xóa gói này?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
            <Button onClick={handleDelete}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Modal
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <BookingEditForm {...props} closeModal={handleCloseEditDialog} />
        </Box>
      </Modal>
      <Modal
        open={detail}
        onClose={handleCloseDetail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>Chi tiết đơn</h1>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Tên khách: <span style={{ textTransform: 'uppercase' }}>{detailId?.vehicleBrand}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Tên tài xế: <span style={{ textTransform: 'uppercase' }}>{detailId?.vehicleBrand}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Điểm đến: <span style={{ textTransform: 'uppercase' }}>{detailId?.from}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Điểm đi: <span style={{ textTransform: 'uppercase' }}>{detailId?.to}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Loại đơn: <span style={{ textTransform: 'uppercase' }}>{detailId?.type}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Giá: <span style={{ textTransform: 'uppercase' }}>{detailId?.price}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Cọc của khách hàng: <span style={{ textTransform: 'uppercase' }}>{detailId?.vehicleBrand}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Trạng thái: <span style={{ textTransform: 'uppercase' }}>{detailId.status === "PROCESSING" && "Đang xử lý"}
                        {detailId.status === "DONE" && "Hoàn thành"}
                        {detailId.status === "CANCEL" && "Đã hủy"}
                        {detailId.status === "PENDING" && "Đang chờ"}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Thời gian tạo đơn: <span style={{ textTransform: 'uppercase' }}>{detailId?.createdAt?.substr(0, 10)}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Thời gian hoàn thành: <span style={{ textTransform: 'uppercase' }}>{detailId?.doneAt?.substr(0, 10)}</span></p>
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
          <ListItemText primary="Chi tiết đơn" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {/* <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
        <MenuItem onClick={handleOpenEditDialog} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Hủy đơn" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
