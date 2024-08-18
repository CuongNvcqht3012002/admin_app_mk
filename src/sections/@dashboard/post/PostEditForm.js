import { Form, FormikProvider, useFormik } from 'formik';
import { CKEditor } from 'ckeditor4-react';
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
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import { useState } from 'react';

const token = JSON.parse(localStorage.getItem('user'));

PostEditForm.propTypes = {
  postId: propTypes.array,
  post: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function PostEditForm(props) {
  const { post, closeModal, reloadData } = props;
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const validation = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    content: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formik = useFormik({
    initialValues: post ?? {
      thumbnailUrl: '',
      title: '',
      content: '',
      isActive: '',
      isHomeActive: '',
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (post != null
        ? axios.patch(`${process.env.REACT_APP_SERVICE_BASE_URL}/post/${post.id}`, values, {
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
        setFieldValue('thumbnailUrl', res.data.data);
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

  const handleChangeContent = content => {
    setFieldValue('content', content.editor.getData());
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              <img src={values.thumbnailUrl} alt={values.thumbnailUrl} style={{ maxWidth: '100%' }} />
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
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
          />
          {touched.title && errors.title ? <FormHelperText error>{errors.title}</FormHelperText> : null}
          <CKEditor
            config={{
              toolbar: [
                {
                  name: 'document',
                  items: ['Print'],
                },
                {
                  name: 'clipboard',
                  items: ['Undo', 'Redo'],
                },
                {
                  name: 'styles',
                  items: ['Format', 'Font', 'FontSize'],
                },
                {
                  name: 'colors',
                  items: ['TextColor', 'BGColor'],
                },
                {
                  name: 'align',
                  items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                },
                '/',
                {
                  name: 'basicstyles',
                  items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting'],
                },
                {
                  name: 'links',
                  items: ['Link', 'Unlink'],
                },
                {
                  name: 'paragraph',
                  items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'],
                },
                {
                  name: 'insert',
                  items: ['Image', 'Table'],
                },
                {
                  name: 'tools',
                  items: ['Maximize'],
                },
                {
                  name: 'editing',
                  items: ['Scayt'],
                },
              ],

              extraAllowedContent: 'h3{clear};h2{line-height};h2 h3{margin-left,margin-top}',

              // Adding drag and drop image upload.
              extraPlugins: 'print,format,font,colorbutton,justify,uploadimage',
              uploadUrl:
                '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',

              // Configure your file manager integration. This example uses CKFinder 3 for PHP.
              filebrowserBrowseUrl: '/apps/ckfinder/3.4.5/ckfinder.html',
              filebrowserImageBrowseUrl: '/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
              filebrowserUploadUrl:
                '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files',
              filebrowserImageUploadUrl:
                '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images',

              height: 560,

              removeDialogTabs: 'image:advanced;link:advanced',
              removeButtons: 'PasteFromWord',
            }}
            data={values.content}
            initData={values.content}
            onBlur={handleChangeContent}
            onChange={handleChangeContent}
            onSelectionChange={handleChangeContent}
          />
          <FormControlLabel
            control={<Checkbox {...getFieldProps('isActive')} checked={values.isActive} name="isActive" />}
            label="Hiện bài viết này"
          />
           <FormControlLabel
            control={<Checkbox {...getFieldProps('isHomeActive')} checked={values.isHomeActive} name="isHomeActive" />}
            label="Hiện bài viết này ở trang chủ"
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
