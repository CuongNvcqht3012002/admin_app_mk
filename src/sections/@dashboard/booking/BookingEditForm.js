import { Form, FormikProvider, useFormik } from 'formik';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';
import * as Yup from 'yup';
import { Typography, Stack, FormHelperText, TextField, Box, FormControlLabel, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

BookingEditForm.propTypes = {
  bookingId: propTypes.array,
  booking: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function BookingEditForm(props) {
  const { booking, closeModal, reloadData } = props;
  const validation = Yup.object().shape({
    cancelReason: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues:  {
      cancelReason: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/booking/admin/${booking.id}/cancel`, values, {
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

  const handleChangeContent = content => {
    setFieldValue('content', content);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Lí do hủy đơn"
            {...getFieldProps('cancelReason')}
            helperText={touched.cancelReason && errors.cancelReason}
            error={Boolean(touched.cancelReason && errors.cancelReason)}
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
