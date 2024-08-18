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
  backgroundColor: theme.palette.error.light,
}));

export default function BooksMonthly(props) {
  const { systemInfo } = props;
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(systemInfo?.bookings)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Số lượng đơn
      </Typography>
    </RootStyle>
  );
}
