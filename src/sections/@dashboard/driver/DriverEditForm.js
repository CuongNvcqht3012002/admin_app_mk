import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Stack, FormHelperText, TextField, Box, Grid, Button, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import { useState } from 'react';


const token = JSON.parse(localStorage.getItem('user'));

DriverEditForm.propTypes = {
  driverId: propTypes.array,
  driver: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function DriverEditForm(props) {
  const { driver, closeModal, reloadData } = props;
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const validation = Yup.object().shape({
    fullName: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    gender: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    address: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: driver ?? {
      fullName: '',
      gender: '',
      address: '',
      avatarUrl: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (driver != null
        ? axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/driver/${driver.id}/profile`, values, {
            headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
          })
        : axios.post(`${process.env.REACT_APP_SERVICE_BASE_URL}/driver/withdraw-request`, values, {
            headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
          })
      )
        .then(() => {
          closeModal();
          reloadData();
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });

  const handleUploadImage = event => {
    // console.log('123');
    setIsUploadingImage(true);
    const f = event.target.files[0];
    const fData = new FormData();
    fData.append('file', f, f.name);
    axios
      .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/upload/image`, fData, {
        headers: {
          token: token.accessToken,
        },
      })
      .then(res => {
        // console.log(res.data);
        // const { fileId, fullUrl } = res.data.data;
        setFieldValue('imageUrl', res.data.data);
        console.log(res);
        // console.log(fileId);
      })
      .catch(error => {
        // setErrors({ error: error.response.data.message.join('ccc') });
        console.log(error);
      })
      .finally(() => setIsUploadingImage(false));
  };

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
        <Grid container spacing={4}>
            <Grid item md={4}>
              <img src={values.imageUrl} alt={values.imageUrl} style={{ maxWidth: '100%' }} />
            </Grid>
            <Grid item md={8}>
              <label htmlFor="upload-img-btn">
                <input
                  onChange={handleUploadImage}
                  accept="image/*"
                  style={{ display: 'none' }}
                  type="file"
                  id="upload-img-btn"
                />
                <Button variant="outlined" component="span">
                  Thêm ảnh minh họa
                </Button>
              </label>
              {isUploadingImage ? <CircularProgress /> : null}
            </Grid>
          </Grid>
          <TextField
            fullWidth
            required
            type="text"
            label="Tên"
            {...getFieldProps('fullName')}
            error={Boolean(touched.fullName && errors.fullName)}
          />
          {touched.fullName && errors.fullName ? <FormHelperText error>{errors.fullName}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Giới tính"
            {...getFieldProps('gender')}
            error={Boolean(touched.gender && errors.gender)}
          />
          {touched.gender && errors.gender ? <FormHelperText error>{errors.gender}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Tên"
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
          />
          {touched.address && errors.address ? <FormHelperText error>{errors.address}</FormHelperText> : null}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
