import React from 'react';
import {
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
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  TablePagination,
} from '@mui/material';
import { Edit, Delete, Visibility, MoreVert } from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => React.ReactNode;
  mobile?: boolean; // Whether to show on mobile
  width?: string | number;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  sx?: any;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
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
          : data.map((row, index) => (
              <Card
                key={index}
                sx={{
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
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" component="div" noWrap>
                      {row[columns[0]?.id] || 'N/A'}
                    </Typography>
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

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {columns.slice(1).map((column) => {
                      if (!column.mobile) return null;
                      
                      const value = row[column.id];
                      const displayValue = column.format ? column.format(value) : value;

                      return (
                        <Box
                          key={column.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {column.label}:
                          </Typography>
                          <Box sx={{ flex: 1, ml: 1 }}>
                            {typeof displayValue === 'string' ? (
                              <Typography variant="body2" noWrap>
                                {displayValue}
                              </Typography>
                            ) : (
                              displayValue
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            ))}

        {onPageChange && (
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
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
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
                  }}
                >
                  {column.label}
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

      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </Paper>
  );
};

export default ResponsiveTable; 