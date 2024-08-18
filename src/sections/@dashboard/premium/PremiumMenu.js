import { useRef, useState } from 'react';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Modal, Box, Snackbar, DialogContent, DialogContentText, Dialog, DialogActions, Button } from '@mui/material';
// component
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import PremiumEditForm from './PremiumEditForm';

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
PremiumMenu.propTypes = {
  premium: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function PremiumMenu(props) {
  const { premium, reloadData } = props;
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      .delete(`${process.env.REACT_APP_SERVICE_BASE_URL}/premium-package/${premium.id}`, {
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
          <PremiumEditForm {...props} closeModal={handleCloseEditDialog} />
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
