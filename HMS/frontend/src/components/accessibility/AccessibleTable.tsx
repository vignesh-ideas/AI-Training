import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Box,
  Typography,
  useTheme,
  Skeleton,
} from '@mui/material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

interface AccessibleTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: any[]) => void;
  onRowClick?: (row: any) => void;
  sortable?: boolean;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  sx?: any;
}

const AccessibleTable: React.FC<AccessibleTableProps> = ({
  columns,
  data,
  loading = false,
  selectable = false,
  onRowSelect,
  onRowClick,
  sortable = false,
  onSort,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  ariaLabel = 'Data table',
  ariaDescribedBy,
  sx,
}) => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(data);
      onRowSelect?.(data);
    } else {
      setSelectedRows([]);
      onRowSelect?.([]);
    }
  };

  const handleSelectRow = (row: any) => {
    const newSelectedRows = selectedRows.includes(row)
      ? selectedRows.filter((r) => r !== row)
      : [...selectedRows, row];
    
    setSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows);
  };

  const handleSort = (columnId: string) => {
    if (!sortable || !onSort) return;

    const newDirection = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnId);
    setSortDirection(newDirection);
    onSort(columnId, newDirection);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 440,
          ...sx,
        }}
      >
        <Table
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    inputProps={{
                      'aria-describedby': 'select-all-description',
                    }}
                  />
                  <Typography
                    id="select-all-description"
                    variant="caption"
                    sx={{ srOnly: true }}
                  >
                    Select all rows in the table
                  </Typography>
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{
                    minWidth: column.width,
                    fontWeight: 600,
                    backgroundColor: theme.palette.grey[100],
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                  sx={{
                    cursor: column.sortable ? 'pointer' : 'default',
                    '&:focus': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: '2px',
                    },
                  }}
                  tabIndex={column.sortable ? 0 : -1}
                  role={column.sortable ? 'button' : undefined}
                  aria-label={column.sortable ? `Sort by ${column.label}` : undefined}
                  aria-sort={
                    column.sortable && sortColumn === column.id
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {column.label}
                    {column.sortable && sortColumn === column.id && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Skeleton variant="rectangular" width={20} height={20} />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.map((row, index) => {
                  const isSelected = selectedRows.includes(row);
                  const rowId = `row-${index}`;

                  return (
                    <TableRow
                      key={index}
                      hover
                      selected={isSelected}
                      onClick={() => onRowClick?.(row)}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        '&:focus-within': {
                          outline: `2px solid ${theme.palette.primary.main}`,
                          outlineOffset: '2px',
                        },
                      }}
                      aria-selected={isSelected}
                    >
                      {selectable && (
                        <TableCell
                          padding="checkbox"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectRow(row)}
                            aria-label={`Select row ${index + 1}`}
                            inputProps={{
                              'aria-describedby': `${rowId}-description`,
                            }}
                          />
                          <Typography
                            id={`${rowId}-description`}
                            variant="caption"
                            sx={{ srOnly: true }}
                          >
                            Select row {index + 1}
                          </Typography>
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const value = row[column.id];
                        const displayValue = column.format ? column.format(value) : value;

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                            tabIndex={onRowClick ? 0 : -1}
                            role={onRowClick ? 'button' : undefined}
                            aria-label={onRowClick ? `Click to view details for row ${index + 1}` : undefined}
                          >
                            {displayValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {onPageChange && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          aria-label="Table pagination"
          sx={{
            '.MuiTablePagination-toolbar': {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        />
      )}
    </Box>
  );
};

export default AccessibleTable; 