// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils

import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.warning.main,
}));

export default function OrderReturn(props) {
  const { totalOrder } = props;
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(totalOrder.returns)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Đơn thu hồi
      </Typography>
    </RootStyle>
  );
}
