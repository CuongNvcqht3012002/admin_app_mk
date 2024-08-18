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
  backgroundColor: theme.palette.success.light,
}));

export default function OrderMonthly(props) {
  const { totalOrder } = props;
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(totalOrder.total)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Đơn cần giao
      </Typography>
    </RootStyle>
  );
}
