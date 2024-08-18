// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import propTypes from 'prop-types';

import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
}));

// TotalUsers.propTypes = {
//   userActive: propTypes.object.isRequired,
// };
export default function TotalDriver(props) {
  const { systemInfo } = props;
  // console.log(systemInfo);
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(systemInfo?.drivers)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Tài xế
      </Typography>
    </RootStyle>
  );
}
