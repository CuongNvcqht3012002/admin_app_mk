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
  backgroundColor: theme.palette.primary.lighter,
}));

export default function RevenueCOD(props) {
  const { totalRevenue } = props;
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(totalRevenue.cod)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Doanh thu qua ship COD
      </Typography>
    </RootStyle>
  );
}
