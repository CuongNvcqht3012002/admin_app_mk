import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { Alert, Stack, TextField, FormControlLabel, Grid, Button, CircularProgress, Checkbox, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';

const token = JSON.parse(localStorage.getItem('user'));

EnterpriseEditForm.propTypes = {
  enterprise: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function EnterpriseEditForm(props) {
  const { enterprise, closeModal, reloadData, regions } = props;
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const validation = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    phone: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    socialUrl: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    description: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: enterprise ?? {
      imageUrl: '',
      name: '',
      phone: '',
      socialUrl: '',
      description: '',
      regionId: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (enterprise != null
        ? axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/enterprise/${enterprise.id}`, values, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        : axios.post(`${process.env.REACT_APP_SERVICE_BASE_URL}/enterprise`, values, {
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

  const getOpObj = option => {
    if (!option.id) option = regions.find(op => op.id === option);
    return option;
  };

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;
  // console.log(values);
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
            label="Tên"
            {...getFieldProps('name')}
            helperText={touched.name && errors.name}
            error={Boolean(touched.name && errors.name)}
          />
          <TextField
            fullWidth
            type="text"
            label="Số điện thoại"
            {...getFieldProps('phone')}
            helperText={touched.phone && errors.phone}
            error={Boolean(touched.phone && errors.phone)}
          />
          <TextField
            fullWidth
            type="text"
            label="Đường dẫn"
            {...getFieldProps('socialUrl')}
            helperText={touched.socialUrl && errors.socialUrl}
            error={Boolean(touched.socialUrl && errors.socialUrl)}
          />
           <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Mô tả"
            {...getFieldProps('description')}
            helperText={touched.description && errors.description}
            error={Boolean(touched.description && errors.description)}
          />
          <Grid item md={12}>
            <Stack spacing={3}>
              <Autocomplete
                required
                id="combo-box-type"
                options={regions}
                getOptionLabel={option => (getOpObj(option) ? getOpObj(option).name : '')}
                onChange={(e, v) => {
                  setFieldValue('regionId', getOpObj(v).id);
                }}
                value={values.regionId}
                renderInput={params => (
                  <TextField {...params} required label="Khu vực" error={Boolean(touched.regionId && errors.regionId)} />
                )}
              />
            </Stack>
          </Grid>
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
