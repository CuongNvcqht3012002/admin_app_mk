// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';

import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.error.light,
}));

export default function OrderDeliveri(props) {
  const { totalOrder } = props;
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(totalOrder.delivering)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Đơn đang giao
      </Typography>
    </RootStyle>
  );
}
