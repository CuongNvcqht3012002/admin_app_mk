import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { Alert, Stack, TextField, FormControlLabel, Grid, Button, CircularProgress, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';

const token = JSON.parse(localStorage.getItem('user'));

RegionEditForm.propTypes = {
  region: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function RegionEditForm(props) {
  const { region, closeModal, reloadData } = props;
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const validation = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: region ?? {
      imageUrl: '',
      name: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (region != null
        ? axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/region/${region.id}`, values, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        : axios.post(`${process.env.REACT_APP_SERVICE_BASE_URL}/region`, values, {
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
          // formikHelpers.setErrors({ error: error.response.data.message });
          console.log(error);
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
            type="text"
            label="Tên khu vực"
            {...getFieldProps('name')}
            helperText={touched.name && errors.name}
            error={Boolean(touched.name && errors.name)}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
        {errors.error != null && (
          <Alert severity="error">
            {typeof errors.error === 'string' ? (
              <p>{errors.error}</p>
            ) : (
              errors.error.map((v, i) => <p key={i.toString()}>{v}</p>)
            )}
          </Alert>
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Gửi yêu cầu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
