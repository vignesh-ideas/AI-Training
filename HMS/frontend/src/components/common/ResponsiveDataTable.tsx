import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  useTheme,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  FilterList,
  Sort,
} from '@mui/icons-material';
import useResponsive from '@/hooks/useResponsive';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => React.ReactNode;
  mobile?: boolean;
  sortable?: boolean;
  width?: string | number;
}

interface ResponsiveDataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  title?: string;
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filterValue: string) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  sx?: any;
}

const ResponsiveDataTable: React.FC<ResponsiveDataTableProps> = ({
  columns,
  data,
  loading = false,
  title,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  searchable = true,
  filterable = true,
  sortable = true,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  onSearch,
  onFilter,
  onSort,
  sx,
}) => {
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilter = (event: any) => {
    const value = event.target.value;
    setFilterValue(value);
    onFilter?.(value);
  };

  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    const newDirection = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnId);
    setSortDirection(newDirection);
    onSort?.(columnId, newDirection);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  const renderMobileCard = (row: any, index: number) => (
    <Card
      key={index}
      sx={{
        mb: 2,
        cursor: onRowClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onRowClick
          ? {
              elevation: 4,
              transform: 'translateY(-2px)',
            }
          : {},
      }}
      onClick={() => onRowClick?.(row)}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="div" noWrap>
              {row[columns[0]?.id] || 'N/A'}
            </Typography>
            {columns[1] && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {row[columns[1].id] || 'N/A'}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onView && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(row);
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            )}
            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={2}>
          {columns.slice(2).map((column) => {
            if (!column.mobile) return null;
            
            const value = row[column.id];
            const displayValue = column.format ? column.format(value) : value;

            return (
              <Grid item xs={6} key={column.id}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {column.label}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {typeof displayValue === 'string' ? displayValue : displayValue}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderDesktopTable = () => (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="responsive table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                style={{
                  minWidth: column.width,
                  fontWeight: 600,
                  cursor: column.sortable ? 'pointer' : 'default',
                }}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {column.label}
                  {column.sortable && sortColumn === column.id && (
                    <Sort
                      fontSize="small"
                      sx={{
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  )}
                </Box>
              </TableCell>
            ))}
            {(onEdit || onDelete || onView) && (
              <TableCell align="center" style={{ width: 100 }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableCell>
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            : data.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    const displayValue = column.format ? column.format(value) : value;

                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {displayValue}
                      </TableCell>
                    );
                  })}
                  {(onEdit || onDelete || onView) && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {onView && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ ...sx }}>
      {/* Header */}
      {title && (
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          component="h2"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          {title}
        </Typography>
      )}

      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        {searchable && (
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}

        {filterable && (
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterValue}
              label="Filter"
              onChange={handleFilter}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Content */}
      {isMobile ? (
        <Box>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </CardContent>
                </Card>
              ))
            : data.map((row, index) => renderMobileCard(row, index))}
        </Box>
      ) : (
        renderDesktopTable()
      )}

      {/* Pagination */}
      {onPageChange && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
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

export default ResponsiveDataTable; 