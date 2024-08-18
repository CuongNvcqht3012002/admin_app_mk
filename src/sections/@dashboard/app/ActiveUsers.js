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
  backgroundColor: theme.palette.info.light,
}));

// ActiveUsers.propTypes = {
//   userActive: propTypes.object.isRequired,
// };
export default function ActiveUsers(props) {
  const { userActive } = props;

  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(userActive.active)}</Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
        Thành viên active
      </Typography>
    </RootStyle>
  );
}
