import { useRef, useState } from 'react';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Modal, Box, Snackbar, DialogContent, DialogContentText, Dialog, DialogActions, Button } from '@mui/material';
// component
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import IndentityEditForm from './IndentityEditForm';

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
  height: '500px',
  overflow: 'auto',
  marginTop: '10px'
};

// ----------------------------------------------------------------------
AboutMenu.propTypes = {
  about: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function AboutMenu(props) {
  const { indentity, reloadData } = props;
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
  const [existDialogOpen, setexistDialogOpen] = useState(false);

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

  const handleSuccess = () => {
    axios
      .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/identity-request/${indentity.id}/review-success`,null, {
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
      .finally(() => {});
  };

  const handleFailed = () => {
    axios
      .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/identity-request/${indentity.id}/review-fail`,null, {
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
      .finally(() => {});
  };

  const handleSnackEditSuccess = () => {
    setsuccessDialogOpen(true);
  };

  const handleSnackExistSuccess = () => {
    setexistDialogOpen(true);
  };

  const handleDetail = () => {
    setIsMenuOpen(false);
    setIsDetail(true);
    axios
      .get(`${process.env.REACT_APP_SERVICE_BASE_URL}/identity-request/${indentity.id}`, {
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
        message="Xét duyệt thành công!"
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={existDialogOpen}
        autoHideDuration={8000}
        onClose={handleClose}
        message="Yêu cầu đã được xét duyệt!"
      />
      <IconButton ref={ref} onClick={() => setIsMenuOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
      {/* <div>
        <Dialog
          open={isDeleteDialogOpen}
          keepMounted
          onClose={handleCloseDeleteDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">Bạn có chắc muốn xóa bài viết này?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
            <Button onClick={handleDelete}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div> */}
      <Modal
        open={detail}
        onClose={handleCloseDetail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>Thông tin chi tiết</h1>
          <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Tên phương tiện: <span style={{ textTransform: 'uppercase' }}>{detailId?.vehicleBrand}</span></p>
          <Box sx={{ display: 'flex' }}>
            <p style={{ paddingRight: '10px', fontSize: '18px' }} className="detail-user">Ảnh mặt trước căn cước: <img style={{ width: '300px', height: '200px' }} src={detailId?.citizenIdFrontImageUrl} alt="" /></p>
            <p style={{ fontSize: '18px' }} className="detail-user">Ảnh mặt sau căn cước: <img style={{ width: '300px', height: '200px' }} src={detailId?.citizenIdBackImageUrl} alt="" /></p>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <p style={{ fontSize: '18px', paddingRight: '10px' }} className="detail-user">Ảnh mặt trước bằng lái: <img style={{ width: '300px', height: '200px' }} src={detailId?.drivingLicenseFrontImageUrl} alt="" /></p>
            <p style={{ fontSize: '18px' }} className="detail-user">Ảnh mặt sau bằng lái: <img style={{ width: '300px', height: '200px' }} src={detailId?.drivingLicenseBackImageUrl} alt="" /></p>
          </Box>
          <p style={{ fontSize: '18px' }} className="detail-user">Hình ảnh phương tiện</p>
          <Box sx={{ display: 'flex' }}>
            {detailId?.vehicleImages?.map((item, index) => (
              <img key={index} style={{ width: '150px', height: '120px', paddingRight: '10px' }} src={item?.url} alt="" />
            ))}
          </Box>
        </Box>
      </Modal>
      <Modal
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style} style={{ width: '70%' }}>
          <IndentityEditForm {...props} closeModal={handleCloseEditDialog} />
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
          <ListItemText primary="Chi tiết danh tính" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleSuccess}>
          <ListItemIcon sx={{ marginRight: 0 }}>
            <Iconify icon="line-md:circle-to-confirm-circle-transition" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xác nhận thành công" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenEditDialog} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon sx={{ marginRight: 0 }}>
            <Iconify icon="icon-park:folder-failed-one" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xác nhận thất bại" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
