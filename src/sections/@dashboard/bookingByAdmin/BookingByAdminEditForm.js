import { Form, FormikProvider, useFormik } from 'formik';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Typography,
  Stack,
  FormHelperText,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Grid,
  Autocomplete,
  FormControl,
  FormLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

BookingByAdminEditForm.propTypes = {
  bookingByAdminId: propTypes.array,
  bookingByAdmin: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function BookingByAdminEditForm(props) {
  const { closeModal, reloadData, regions, vehicles } = props;
  const validation = Yup.object().shape({
    vehicleCategory: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    from: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    to: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    note: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    startAt: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    endAt: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    regionId: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: {
      vehicleCategory: '',
      from: '',
      to: '',
      note: '',
      startAt: '',
      endAt: '',
      regionId: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(
          `${process.env.REACT_APP_SERVICE_BASE_URL}/booking/admin`,
          {
            vehicleCategory: `${values.vehicleCategory} chỗ`,
            from: values.from,
            to: values.to,
            note: values.note,
            startAt: new Date(values.startAt).toISOString(),
            endAt: new Date(values.endAt).toISOString(),
            regionId: values.regionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          },
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

  const handleChangeContent = content => {
    setFieldValue('content', content);
  };

  const getOpObj = option => {
    if (!option.id) option = regions.find(op => op.id === option);
    return option;
  };

  // console.log(vehicles);

  const getOpObjVehicle = option => {
    if (!option.seat) option = vehicles.find(op => op.seat === option);
    return option;
  };

  // const allOptions = regions.map(option => getOpObj(option));
  // console.log(allOptions);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
        <Grid item md={12}>
            <Stack spacing={3}>
              <Autocomplete
                required
                id="combo-box-type"
                options={vehicles}
                getOptionLabel={option => (getOpObjVehicle(option) ? getOpObjVehicle(option).seat : '')}
                onChange={(e, v) => {
                  setFieldValue('vehicleCategory', getOpObjVehicle(v).seat);
                }}
                value={values.vehicleCategory}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label="Loại xe"
                    error={Boolean(touched.vehicleCategory && errors.vehicleCategory)}
                  />
                )}
              />
            </Stack>
          </Grid>
          <TextField
            fullWidth
            required
            type="text"
            label="Điểm đi"
            {...getFieldProps('from')}
            error={Boolean(touched.from && errors.from)}
          />
          {touched.from && errors.from ? <FormHelperText error>{errors.from}</FormHelperText> : null}
          <TextField
            fullWidth
            required
            type="text"
            label="Điểm đến"
            {...getFieldProps('to')}
            error={Boolean(touched.to && errors.to)}
          />
          {touched.to && errors.to ? <FormHelperText error>{errors.to}</FormHelperText> : null}
          <FormControl fullWidth required>
            <FormLabel htmlFor="startAt">Bắt đầu</FormLabel>
            <TextField
              id="startAt"
              type="date"
              {...getFieldProps('startAt')}
              error={Boolean(touched.startAt && errors.startAt)}
            />
          </FormControl>
          <FormControl fullWidth required>
            <FormLabel htmlFor="startAt">Kết thúc</FormLabel>
            <TextField
              id="endAt"
              type="date"
              {...getFieldProps('endAt')}
              error={Boolean(touched.endAt && errors.endAt)}
            />
          </FormControl>
          <TextField
            multiline
            rows={8}
            maxRows={16}
            required
            fullWidth
            type="text"
            label="Ghi chú"
            {...getFieldProps('note')}
            helperText={touched.note && errors.note}
            error={Boolean(touched.note && errors.note)}
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
                  <TextField
                    {...params}
                    required
                    label="Khu vực"
                    error={Boolean(touched.regionId && errors.regionId)}
                  />
                )}
              />
            </Stack>
          </Grid>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
