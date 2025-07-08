import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  TablePagination,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Download,
  Refresh,
  PersonAdd,
  Visibility,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { UserRole, UserStatus } from '@/types/auth';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  profilePicture?: string;
}

interface UserManagementProps {}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'john.doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.DOCTOR,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:45:00Z',
      },
      {
        id: '2',
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.NURSE,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-19T16:20:00Z',
      },
      {
        id: '3',
        username: 'mike.wilson',
        email: 'mike.wilson@example.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        role: UserRole.PATIENT,
        status: UserStatus.INACTIVE,
        createdAt: '2024-01-05T11:00:00Z',
        lastLogin: '2024-01-15T13:30:00Z',
      },
      {
        id: '4',
        username: 'sarah.johnson',
        email: 'sarah.johnson@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: UserRole.PHARMACIST,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-12T08:45:00Z',
        lastLogin: '2024-01-20T10:15:00Z',
      },
      {
        id: '5',
        username: 'david.brown',
        email: 'david.brown@example.com',
        firstName: 'David',
        lastName: 'Brown',
        role: UserRole.LAB_TECHNICIAN,
        status: UserStatus.SUSPENDED,
        createdAt: '2024-01-08T14:20:00Z',
        lastLogin: '2024-01-18T09:45:00Z',
      },
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event: any) => {
    setRoleFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const pageUserIds = filteredUsers
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(user => user.id);
      setSelectedUsers(pageUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserAction = (action: string, user?: User) => {
    const targetUser = user || selectedUser;
    if (!targetUser) return;

    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      switch (action) {
        case 'activate':
          updateUserStatus(targetUser.id, UserStatus.ACTIVE);
          break;
        case 'deactivate':
          updateUserStatus(targetUser.id, UserStatus.INACTIVE);
          break;
        case 'suspend':
          updateUserStatus(targetUser.id, UserStatus.SUSPENDED);
          break;
        case 'delete':
          deleteUser(targetUser.id);
          break;
      }
      setLoading(false);
      setAnchorEl(null);
      setSelectedUser(null);
    }, 1000);
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status } : user
      )
    );
    toast.success(`User status updated to ${status.toLowerCase()}`);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSelectedUsers(prev => prev.filter(id => id !== userId));
    toast.success('User deleted successfully');
    setShowDeleteDialog(false);
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      switch (action) {
        case 'activate':
          selectedUsers.forEach(userId => updateUserStatus(userId, UserStatus.ACTIVE));
          break;
        case 'deactivate':
          selectedUsers.forEach(userId => updateUserStatus(userId, UserStatus.INACTIVE));
          break;
        case 'delete':
          selectedUsers.forEach(userId => deleteUser(userId));
          break;
      }
      setSelectedUsers([]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'success';
      case UserStatus.INACTIVE:
        return 'warning';
      case UserStatus.SUSPENDED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return 'primary';
      case UserRole.NURSE:
        return 'secondary';
      case UserRole.PATIENT:
        return 'success';
      case UserRole.PHARMACIST:
        return 'warning';
      case UserRole.LAB_TECHNICIAN:
        return 'info';
      default:
        return 'default';
    }
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => toast.info('Add user functionality coming soon')}
        >
          Add User
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} onChange={handleRoleFilterChange} label="Role">
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value={UserRole.DOCTOR}>Doctor</MenuItem>
            <MenuItem value={UserRole.NURSE}>Nurse</MenuItem>
            <MenuItem value={UserRole.PATIENT}>Patient</MenuItem>
            <MenuItem value={UserRole.PHARMACIST}>Pharmacist</MenuItem>
            <MenuItem value={UserRole.LAB_TECHNICIAN}>Lab Technician</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={handleStatusFilterChange} label="Status">
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value={UserStatus.ACTIVE}>Active</MenuItem>
            <MenuItem value={UserStatus.INACTIVE}>Inactive</MenuItem>
            <MenuItem value={UserStatus.SUSPENDED}>Suspended</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => toast.info('Export functionality coming soon')}
        >
          Export
        </Button>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            setSearchTerm('');
            setRoleFilter('all');
            setStatusFilter('all');
            setSelectedUsers([]);
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">
              {selectedUsers.length} user(s) selected
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => handleBulkAction('activate')}
                disabled={loading}
              >
                Activate
              </Button>
              <Button
                size="small"
                onClick={() => handleBulkAction('deactivate')}
                disabled={loading}
              >
                Deactivate
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleBulkAction('delete')}
                disabled={loading}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < paginatedUsers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.profilePicture}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={getStatusColor(user.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedUser(user);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleUserAction('view')}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleUserAction('edit')}>
          <Edit sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => handleUserAction('activate')}>
          <CheckCircle sx={{ mr: 1 }} />
          Activate
        </MenuItem>
        <MenuItem onClick={() => handleUserAction('deactivate')}>
          <Block sx={{ mr: 1 }} />
          Deactivate
        </MenuItem>
        <MenuItem onClick={() => handleUserAction('suspend')}>
          <Block sx={{ mr: 1 }} />
          Suspend
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowDeleteDialog(true);
            setAnchorEl(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUserAction('delete')}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default UserManagement; 