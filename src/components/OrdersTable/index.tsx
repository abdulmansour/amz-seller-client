import { FilterOption } from '@components/FilterGroup';
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
import { OrderItem } from '@sp-api-sdk/orders-api-v0';
import currency from 'currency.js';
import * as React from 'react';
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { TableCellCurrency } from './styled';

export interface Data {
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
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
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
  salesSum: number;
  numSelected: number;
  targetCurrency: Currency;
}

function EnhancedTableToolbar({
  numSelected,
  salesSum,
  targetCurrency,
}: EnhancedTableToolbarProps) {
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
          Products ({currency(salesSum).format()} {targetCurrency})
        </Typography>
      )}
    </Toolbar>
  );
}

export interface OrdersTableProps {
  orders?: CustomOrder[];
  targetCurrency: Currency;
  rates?: Record<Currency, number>;
  skuFilters?: Record<string, FilterOption> | undefined;
}

export const getSkusFromSkuFilters = (
  skuFilters: Record<string, FilterOption> | undefined
) => {
  if (skuFilters) {
    const skus = Object.values(skuFilters).reduce((a, filterOption) => {
      if (filterOption?.selected) {
        a.push(filterOption.value);
        return a;
      }
      return a;
    }, [] as string[]);
    return skus;
  } else {
    return [];
  }
};

export const _parseFloat = (v?: string) => {
  return v ? parseFloat(v) : 0;
};

export const computeItemPrice = (
  item: OrderItem,
  units: number,
  rates?: Record<Currency, number> | undefined,
  targetCurrency?: Currency
) => {
  if (item.ItemPrice?.Amount) {
    const amount =
      (_parseFloat(item.ItemPrice?.Amount) +
        _parseFloat(item.ItemTax?.Amount) +
        _parseFloat(item.ShippingPrice?.Amount) +
        _parseFloat(item.ShippingTax?.Amount) +
        _parseFloat(item.BuyerInfo?.GiftWrapPrice?.Amount) +
        _parseFloat(item.BuyerInfo?.GiftWrapTax?.Amount) -
        _parseFloat(item.ShippingDiscount?.Amount) -
        _parseFloat(item.ShippingDiscountTax?.Amount) -
        _parseFloat(item.PromotionDiscount?.Amount) -
        _parseFloat(item.PromotionDiscountTax?.Amount)) *
      units;

    if (rates && targetCurrency) {
      const adjustedAmount =
        (amount * rates[targetCurrency]) /
        rates[item.ItemPrice?.CurrencyCode as Currency];
      return adjustedAmount;
    }

    return amount;
  }
  return 0;
};

export const computeOrderedUnits = (item: OrderItem) => {
  if (item.QuantityOrdered) {
    return item.QuantityOrdered;
  } else {
    const numberOfItems: string | number | undefined =
      item.ProductInfo?.NumberOfItems;

    const units = numberOfItems
      ? typeof numberOfItems === 'string'
        ? parseInt(numberOfItems as string)
        : numberOfItems
      : 0;
    return units;
  }
};

export const computeSkuStats = (
  orders: CustomOrder[] | undefined,
  rates: Record<Currency, number> | undefined,
  targetCurrency: Currency,
  skus: string[]
) => {
  const stats = orders?.reduce((a, order) => {
    order.OrderItems?.forEach((item) => {
      if (
        item.SellerSKU &&
        (skus.length === 0 || skus.includes(item.SellerSKU))
      ) {
        if (!(item.SellerSKU in a)) {
          a[item.SellerSKU] = {
            sku: item.SellerSKU,
            sales: 0,
            orders: 0,
            units: 0,
          };
        }
        const units = computeOrderedUnits(item);
        const price = computeItemPrice(item, units, rates, targetCurrency);

        a[item.SellerSKU].units += units;
        a[item.SellerSKU].sales += price;

        a[item.SellerSKU].orders += 1;
      }
    });

    return a;
  }, {} as Record<string, Data>);

  return stats ? stats : {};
};

const OrdersTable = ({
  orders,
  rates,
  targetCurrency,
  skuFilters,
}: OrdersTableProps) => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('sales');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [rows, setRows] = useState<Data[]>([]);

  useEffect(() => {
    if (orders && rates && skuFilters) {
      const skus = getSkusFromSkuFilters(skuFilters);
      const stats = computeSkuStats(orders, rates, targetCurrency, skus);
      setRows(Object.values(stats));
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

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const salesSum = rows.reduce((a, row) => {
    return a + row.sales;
  }, 0);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          salesSum={salesSum}
          targetCurrency={targetCurrency}
        />
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
          rowsPerPageOptions={[10, 25, 50]}
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
};

export default memo(OrdersTable);
