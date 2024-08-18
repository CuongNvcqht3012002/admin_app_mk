import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import axios from 'axios';
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Email không được để trống'),
    password: Yup.string().required('Mật khẩu không được để trống'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true,
      error: null,
    },
    validationSchema: LoginSchema,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(`${process.env.REACT_APP_SERVICE_BASE_URL}/auth/admin/sign-in`, {
          username: values.username,
          password: values.password,
        })
        .then(response => {
          if (response.data.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            window.location.reload(true);
            navigate('/dashboard/app', { replace: true });
          } else {
            formikHelpers.setSubmitting(false);
          }
          // console.log(response.data.data);
        })
        .catch(error => {
          formikHelpers.setSubmitting(false);
          formikHelpers.setErrors({ error: error.response.data.message });
        });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword(show => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="username"
            label="Tên đăng nhập"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
        {errors.error != null && <Alert severity="error">{errors.error}</Alert>}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Đăng nhập
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
