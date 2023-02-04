import { Currency } from '@components/SalesCard';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { CustomOrder } from '@pages/index';
import currency from 'currency.js';
import * as React from 'react';
import { TableCellCurrency } from './styled';

interface Data {
  sku: string;
  sales: number;
  orders: number;
  units: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'sku',
    numeric: false,
    disablePadding: true,
    label: 'Product',
  },
  {
    id: 'sales',
    numeric: true,
    disablePadding: false,
    label: 'Sales',
  },
  {
    id: 'orders',
    numeric: true,
    disablePadding: false,
    label: 'Orders',
  },
  {
    id: 'units',
    numeric: true,
    disablePadding: false,
    label: 'Units',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="justify"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Products
        </Typography>
      )}
    </Toolbar>
  );
}

export interface OrdersTableProps {
  orders?: CustomOrder[];
  targetCurrency: Currency;
  rates?: Record<Currency, number>;
}

export default function OrdersTable({
  orders,
  rates,
  targetCurrency,
}: OrdersTableProps) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('sales');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Data[]>([]);

  React.useEffect(() => {
    if (orders && rates) {
      const ordersT = orders.reduce((a, order) => {
        order.OrderItems?.forEach((item) => {
          if (item.SellerSKU) {
            if (!(item.SellerSKU in a)) {
              a[item.SellerSKU] = {
                sku: item.SellerSKU,
                sales: 0,
                orders: 0,
                units: 0,
              };
            }

            a[item.SellerSKU].orders = a[item.SellerSKU].orders + 1;

            const numberOfItems: string | number | undefined =
              item.ProductInfo?.NumberOfItems;

            const units = numberOfItems
              ? typeof numberOfItems === 'string'
                ? parseInt(numberOfItems as string)
                : numberOfItems
              : 0;
            a[item.SellerSKU].units = a[item.SellerSKU].units + units;

            if (item.ItemPrice) {
              const compute = (v?: string) => {
                return v ? parseFloat(v) : 0;
              };

              const amount =
                (((compute(item.ItemPrice?.Amount) +
                  compute(item.ItemTax?.Amount) +
                  compute(item.ShippingPrice?.Amount) +
                  compute(item.ShippingTax?.Amount) -
                  compute(item.ShippingDiscount?.Amount) -
                  compute(item.ShippingDiscountTax?.Amount) -
                  compute(item.PromotionDiscount?.Amount) -
                  compute(item.PromotionDiscountTax?.Amount)) *
                  rates[targetCurrency]) /
                  rates[item.ItemPrice?.CurrencyCode as Currency]) *
                units;

              a[item.SellerSKU].sales = a[item.SellerSKU].sales + amount;
            }
          }
        });

        return a;
      }, {} as Record<string, Data>);

      setRows(Object.values(ordersT));
    }
  }, [orders, rates]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.sku);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.sku);

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.sku}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" scope="row">
                        {row.sku}
                      </TableCell>
                      <TableCellCurrency align="justify">
                        {`${currency(row.sales).format()} ${targetCurrency}`}
                      </TableCellCurrency>
                      <TableCell align="justify">{row.orders}</TableCell>
                      <TableCell align="justify">{row.units}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
