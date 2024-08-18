import { Form, FormikProvider, useFormik } from 'formik';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';
import * as Yup from 'yup';
import { Typography, Stack, FormHelperText, TextField, Box, FormControlLabel, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

BankingEditForm.propTypes = {
  bankingId: propTypes.array,
  banking: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function BankingEditForm(props) {
  const { banking, closeModal, reloadData } = props;
  const validation = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    price: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    month: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: banking ?? {
      name: '',
      price: '',
      month: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (banking != null
        ? axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/setting/banking/${banking.id}`, values, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        : axios.post(`${process.env.REACT_APP_SERVICE_BASE_URL}/setting/banking`, values, {
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

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleChangeContent = (content) => {
    setFieldValue('content', content)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            required
            type="text"
            label="Tên gói"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
          />
          {touched.name && errors.name ? <FormHelperText error>{errors.name}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="number"
            label="Giá tiền"
            {...getFieldProps('price')}
            error={Boolean(touched.price && errors.price)}
          />
          {touched.price && errors.price ? <FormHelperText error>{errors.price}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="number"
            label="Thời gian sử dụng"
            {...getFieldProps('month')}
            error={Boolean(touched.month && errors.month)}
          />
          {touched.month && errors.month ? <FormHelperText error>{errors.month}</FormHelperText> : null}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
