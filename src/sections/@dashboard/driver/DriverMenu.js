import { useRef, useState } from 'react';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Modal, Box, Snackbar, DialogContentText, DialogContent, Dialog, Button, DialogActions } from '@mui/material';
// component
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import DriverEditForm from './DriverEditForm';

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
DriverMenu.propTypes = {
  driver: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function DriverMenu(props) {
  const { driver, reloadData } = props;
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUnLockDialogOpen, setIsUnLockDialogOpen] = useState(false);
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
  const handleOpenUnLock = () => {
    setIsMenuOpen(false);
    setIsUnLockDialogOpen(true);
  }
  const handleCloseEditDialog = () => {
    setIsMenuOpen(false);
    setIsDialogOpen(false);
  };
  // ============== Snackbar Delete ==============
  const [successDialogOpen, setsuccessDialogOpen] = useState(false);
  const [successUnLockDialogOpen, setsuccessUnLockDialogOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setsuccessDialogOpen(false);
    setsuccessUnLockDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };
  const handleCloseLockDialog = () => {
    setIsMenuOpen(false);
    setIsUnLockDialogOpen(false);
  };

  const handleLock = () => {
    axios
      .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/driver/${driver.id}/ban`,null, {
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

  const handleUnLock = () => {
    axios
      .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/driver/${driver.id}/unban`,null, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(() => {
        handleCloseLockDialog();
        reloadData();
        handleSnackSuccessUnLock();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  const handleSnackEditSuccess = () => {
    setsuccessDialogOpen(true);
  };
  const handleSnackSuccessUnLock = () => {
    setsuccessUnLockDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setIsMenuOpen(false);
    setIsDetail(false);
  };

  const handleDetail = () => {
    setIsMenuOpen(false);
    setIsDetail(true);
    axios
      .get(`${process.env.REACT_APP_SERVICE_BASE_URL}/driver/${driver.id}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
      .then(response => {
        setDetailId(response.data.data);
      });
  };


  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Khóa tài xế thành công!"

        // action={action}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successUnLockDialogOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Mở khóa tài xế thành công!"

        // action={action}
      />
      <IconButton ref={ref} onClick={() => setIsMenuOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
      <Modal
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <DriverEditForm {...props} closeModal={handleCloseEditDialog} />
        </Box>
      </Modal>
      <div>
        <Dialog
          open={isDeleteDialogOpen}
          keepMounted
          onClose={handleCloseDeleteDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">Bạn có chắc muốn khóa tài xế này?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
            <Button onClick={handleLock}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isUnLockDialogOpen}
          keepMounted
          onClose={handleCloseDeleteDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">Bạn có chắc muốn mở khóa tài xế này?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsUnLockDialogOpen(false)}>Không</Button>
            <Button onClick={handleUnLock}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Modal
        open={detail}
        onClose={handleCloseDetail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Thông tin chi tiết</h2>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Tên: <span style={{ textTransform: 'uppercase' }}>{detailId?.fullName}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Số điện thoại: <span style={{ textTransform: 'uppercase' }}>{detailId?.phone}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Email: <span style={{ textTransform: 'uppercase' }}>{detailId?.email}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Giới tính: <span style={{ textTransform: 'uppercase' }}>{detailId?.gender}</span></p>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Địa chỉ: <span style={{ textTransform: 'uppercase' }}>{detailId?.address}</span></p>
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
          <ListItemText primary="Chi tiết tài xế" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <Iconify icon="ic:outline-lock" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Khóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenUnLock}>
          <ListItemIcon>
            <Iconify icon="ic:outline-lock" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Mở khóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenEditDialog} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Sửa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
