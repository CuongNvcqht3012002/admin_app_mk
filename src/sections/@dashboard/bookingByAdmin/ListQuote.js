import { useEffect, useState, useMemo, useCallback } from 'react';
// material
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import axios from 'axios';
import { debounce } from 'lodash';
import propTypes from 'prop-types';
import Page from '../../../components/Page';
//
import Scrollbar from '../../../components/Scrollbar';
import { UserListHead } from '../user';
import '../../../assets/css/new.css';
import ListQuoteMenu from './ListQuoteMenu';

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

ListQuotePage.propTypes = {
  showSnack: propTypes.func,
};

export default function ListQuotePage(props) {
  const { listQuote } = props;
  const [quote, setQuote] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);


  const TABLE_HEAD = [
    { id: 'fullName', label: 'Tên tài xế', alignRight: false },
    { id: 'brand', label: 'Phương tiện', alignRight: false },
    { id: 'seat', label: 'Chỗ ngồi', alignRight: false },
    { id: 'plate', label: 'Biển số', alignRight: false },
    { id: 'createdAt', label: 'Ngày báo giá', alignRight: false },
  ];

  console.log(listQuote.data);


  return (
    <Page title="Quản lý đơn admin">
      <Container>
        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                {listQuote?.data?.map(item => (
                    <TableRow hover tabIndex={-1}>
                    <TableCell align="left">{item?.driver.fullName}</TableCell>
                    <TableCell align="left">{item?.driver.vehicle.brand}</TableCell>
                    <TableCell align="left">{item?.driver.vehicle.seat}</TableCell>
                    <TableCell align="left">{item?.driver.vehicle.plate}</TableCell>
                    <TableCell align="left">{item?.createdAt?.substr(0, 10)}</TableCell>
                    <TableCell align="right">
                        <ListQuoteMenu ListQuote={item} />
                    </TableCell>
                    </TableRow>
                ))}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
