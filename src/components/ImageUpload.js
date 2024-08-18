import { Close } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { nanoid } from 'nanoid';
import axios from 'axios';
import propTypes from 'prop-types';
import WIcoUploadImage from '../assets/icons/w_ico_upload.svg';

const ImagePreviewWrapper = styled('div')({
  position: 'relative',
  height: '140px',
  width: '140px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '8px',
});

const ImagePreviewDeleteButton = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
});

const ImagePreviewUploading = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

ImageUpload.propTypes = {
  preImage: propTypes.string,
  token: propTypes.string,
  onUploadComplete: propTypes.func,
  visible: propTypes.bool,
  showSnack: propTypes.func,
};

ImageUpload.defaultProps = {
  visible: true,
  showSnack: () => {},
};

export default function ImageUpload(props) {
  const [image, setImage] = useState(props.preImage !== '' ? props.preImage : WIcoUploadImage);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (props.preImage === 'ignore') {
      setImage(WIcoUploadImage);
    }
  }, [props.preImage, image]);

  const inputId = `vp-image-${nanoid()}`;

  const isUploaded = image !== WIcoUploadImage;

  const uploadImage = event => {
    setIsUploading(true);
    const f = event.target.files[0];
    const fData = new FormData();
    fData.append('file', f, f.name);
    axios
      .post(`${process.env.REACT_APP_URL}/upload`, fData, {
        headers: {
          token: props.token,
        },
      })
      .then(res => {
        const { fullUrl } = res.data.data;
        console.log(res.data.data);
        props.onUploadComplete(fullUrl);
        setImage(fullUrl);
        props.showSnack('success', 'Tải ảnh lên thành công!');
      })
      .catch(error => {
        console.log(error);
        props.showSnack('error', 'Lỗi khi tải ảnh lên!');
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <>
      <ImagePreviewWrapper
        onClick={() => (isUploaded ? null : document.getElementById(inputId)?.click())}
        sx={{
          backgroundImage: `url("${image}")`,
          cursor: isUploaded ? 'initial' : 'pointer',
          display: props.visible ? 'block' : 'none',
        }}
      >
        <img src={image} style={{ opacity: 0 }} alt="" width={140} height={140} />
        {isUploaded ? (
          <ImagePreviewDeleteButton
            onClick={() => {
              setImage(WIcoUploadImage);
              props.onUploadComplete('');
            }}
          >
            <Close
              sx={{
                backgroundColor: 'white',
                cursor: 'pointer',
                borderBottomLeftRadius: '5px',
              }}
            />
          </ImagePreviewDeleteButton>
        ) : null}
        {isUploading ? (
          <ImagePreviewUploading>
            <CircularProgress />
          </ImagePreviewUploading>
        ) : null}
      </ImagePreviewWrapper>

      <input onChange={uploadImage} accept="image/*" style={{ display: 'none' }} type="file" id={inputId} />
    </>
  );
}
