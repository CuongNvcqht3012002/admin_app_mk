import { Form, FormikProvider, useFormik } from 'formik';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';
import * as Yup from 'yup';
import { Typography, Stack, FormHelperText, TextField, Box, FormControlLabel, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

BookingDepositEditForm.propTypes = {
  bookingDepositId: propTypes.array,
  bookingDeposit: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function BookingDepositEditForm(props) {
  const { bookingDeposit, closeModal, reloadData } = props;
  const validation = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    content: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: bookingDeposit ?? {
      title: '',
      content: '',
      isActive: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (bookingDeposit != null
        ? axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/post/${bookingDeposit.id}`, values, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        : axios.post(`${process.env.REACT_APP_SERVICE_BASE_URL}/post`, values, {
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
            label="Tiêu đề"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
          />
          {touched.title && errors.title ? <FormHelperText error>{errors.title}</FormHelperText> : null}
          <Typography variant="p">Nội dung</Typography>
          <SunEditor
            autoFocus={false}
            onChange={handleChangeContent}
            setContents={values.content}
            height="200"
            setOptions={{
              buttonList: [
                [
                  'fontSize',
                  'bold',
                  'underline',
                  'italic',
                  'strike',
                  'subscript',
                  'superscript',
                  'removeFormat',
                  'fontColor',
                  'link',
                  'indent',
                  'outdent',
                  'align',
                  'undo',
                  'redo',
                  'codeView',
                  'print',
                  'table',
                  'list',
                ],
              ],
            }}
          />
          <FormControlLabel
            control={<Checkbox {...getFieldProps('isActive')} checked={values.isActive} name="isActive" />}
            label="Hiện bài viết này"
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
