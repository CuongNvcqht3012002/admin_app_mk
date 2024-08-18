import { Form, FormikProvider, useFormik } from 'formik';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';
import * as Yup from 'yup';
import { Typography, Stack, FormHelperText, TextField, Box, FormControlLabel, Checkbox, Button, CircularProgress, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import { useState } from 'react';

const token = JSON.parse(localStorage.getItem('user'));

SettingEditForm.propTypes = {
  settingId: propTypes.array,
  setting: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function SettingEditForm(props) {
  const { setting, closeModal, reloadData } = props;
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const validation = Yup.object().shape({
    registrationTitle: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    registrationDescription: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    hotline: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    bankName: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    bankAccountNumber: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    bankAccountOwner: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    bankTransferNotice: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    termsAndPolicy: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    support: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: setting ?? {
      registrationImageUrl: '',
      registrationTitle: '',
      registrationDescription: '',
      termsAndPolicy: '',
      support: '',
      hotline: '',
      bankName: '',
      bankAccountNumber: '',
      bankAccountOwner: '',
      bankTransferNotice: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/setting`, values, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })
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

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleChangeContent = (content) => {
    setFieldValue('content', content)
  }

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
        setFieldValue('registrationImageUrl', res.data.data);
        console.log(res);
        // console.log(fileId);
      })
      .catch(error => {
        // setErrors({ error: error.response.data.message.join('ccc') });
        console.log(error);
      })
      .finally(() => setIsUploadingImage(false));
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
        <Grid container spacing={4}>
            <Grid item md={4}>
              <img src={values.registrationImageUrl} alt={values.registrationImageUrl} style={{ maxWidth: '100%' }} />
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
            label="Tiêu đề"
            {...getFieldProps('registrationTitle')}
            error={Boolean(touched.registrationTitle && errors.registrationTitle)}
          />
          {touched.registrationTitle && errors.registrationTitle ? <FormHelperText error>{errors.registrationTitle}</FormHelperText> : null}
          <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Điều khoản và chính sách"
            {...getFieldProps('termsAndPolicy')}
            helperText={touched.termsAndPolicy && errors.termsAndPolicy}
            error={Boolean(touched.termsAndPolicy && errors.termsAndPolicy)}
          />
          <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Hỗ trợ"
            {...getFieldProps('support')}
            helperText={touched.support && errors.support}
            error={Boolean(touched.support && errors.support)}
          />
          <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Mô tả"
            {...getFieldProps('registrationDescription')}
            helperText={touched.registrationDescription && errors.registrationDescription}
            error={Boolean(touched.registrationDescription && errors.registrationDescription)}
          />
          <TextField
            fullWidth
            required
            type="text"
            label="Hotline"
            {...getFieldProps('hotline')}
            error={Boolean(touched.hotline && errors.hotline)}
          />
          {touched.hotline && errors.hotline ? <FormHelperText error>{errors.hotline}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Tên ngân hàng"
            {...getFieldProps('bankName')}
            error={Boolean(touched.bankName && errors.bankName)}
          />
          {touched.bankName && errors.bankName ? <FormHelperText error>{errors.bankName}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Số tài khoản"
            {...getFieldProps('bankAccountNumber')}
            error={Boolean(touched.bankAccountNumber && errors.bankAccountNumber)}
          />
          {touched.bankAccountNumber && errors.bankAccountNumber ? <FormHelperText error>{errors.bankAccountNumber}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Chủ tài khoản"
            {...getFieldProps('bankAccountOwner')}
            error={Boolean(touched.bankAccountOwner && errors.bankAccountOwner)}
          />
          {touched.bankAccountOwner && errors.bankAccountOwner ? <FormHelperText error>{errors.bankAccountOwner}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Nội dung"
            {...getFieldProps('bankTransferNotice')}
            error={Boolean(touched.bankTransferNotice && errors.bankTransferNotice)}
          />
          {touched.bankTransferNotice && errors.bankTransferNotice ? <FormHelperText error>{errors.bankTransferNotice}</FormHelperText> : null}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Cập nhật
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
