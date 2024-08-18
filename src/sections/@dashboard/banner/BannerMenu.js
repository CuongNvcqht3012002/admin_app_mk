import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
  Box,
  Snackbar,
  Stack,
  TextField,
  InputAdornment,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// component
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import BannerEditForm from './BannerEditForm';

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
SEOMenu.propTypes = {
  banner: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function SEOMenu(props) {
  const { banner, status, reloadData } = props;
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenEditDialog = () => {
    setIsDialogOpen(true);
    setIsMenuOpen(false);
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

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_SERVICE_BASE_URL}/banner/${banner.id}`, {
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

  const handleOpenDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleSnackEditSuccess = () => {
    setsuccessDialogOpen(true);
  };

  const handleCloseDeductDialog = () => {
    setIsMenuOpen(false);
    setIsDetailDialogOpen(false);
  };

  
  const handleCloseDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
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
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={4500}
        onClose={handleClose}
        message="Sửa thành công!"

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
            <DialogContentText id="alert-dialog-slide-description">Bạn có chắc muốn xóa banner này?</DialogContentText>
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
          <BannerEditForm {...props} closeModal={handleCloseEditDialog} />
        </Box>
      </Modal>
      <Modal
        open={isDetailDialogOpen}
        onClose={handleCloseDeductDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style}>
          <h2>Chi tiết quà tặng</h2>
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
         <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
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
