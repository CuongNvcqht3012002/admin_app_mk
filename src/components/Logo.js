import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

const useStyles = makeStyles({
  box: {
    justifyContent: 'center',
  },
});

export default function Logo({ sx }) {
  const classes = useStyles();
  return (
    <RouterLink to="/" className={classes.box}>
      <Box component="img" src="/static/logo-1.png" sx={{ width: '90%', height: '90%', ...sx }} />
    </RouterLink>
  );
}
