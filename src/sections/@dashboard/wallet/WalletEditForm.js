import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Stack, FormHelperText, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';


const token = JSON.parse(localStorage.getItem('user'));

WalletEditForm.propTypes = {
  walletId: propTypes.array,
  wallet: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function WalletEditForm(props) {
  const { wallet, closeModal, reloadData } = props;
  const validation = Yup.object().shape({
    amount: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    description: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: wallet ?? {
      amount: '',
      description: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (wallet != null
        ? axios.put(`${process.env.REACT_APP_SERVICE_BASE_URL}/wallet/${wallet.id}`, values, {
            headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
          })
        : axios.post(`${process.env.REACT_APP_SERVICE_BASE_URL}/wallet/withdraw-request`, values, {
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

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            required
            type="text"
            label="Số lượng"
            {...getFieldProps('amount')}
            error={Boolean(touched.amount && errors.amount)}
          />
          {touched.amount && errors.amount ? <FormHelperText error>{errors.amount}</FormHelperText> : null}
          <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Mô tả"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
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
