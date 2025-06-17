import './styles/UserManagement.css'

const UserManagement = () => {
  return (
    <div>UserManagement</div>
  )
}

export default UserManagement



// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import {
//   Search, Filter, Download, Users, UserCheck, UserX,
//   ChevronDown, ChevronUp, ArrowUpDown, Loader, Home,
//   AlertTriangle, CheckCircle
// } from 'lucide-react';
// import ConfirmationModal from '../ConfirmationModal';
// import './UserManagement.css';

// const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

// const mockUsers = [
//   {
//     id: '1',
//     username: 'john.doe',
//     email: 'john.doe@example.com',
//     status: 'active',
//     registrationDate: '2023-01-15T08:30:00Z'
//   },
//   {
//     id: '2',
//     username: 'jane.smith',
//     email: 'jane.smith@example.com',
//     status: 'inactive',
//     registrationDate: '2023-02-20T14:15:00Z'
//   },
//   // Add more mock users as needed
// ];

// const UserManagement = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUsers, setSelectedUsers] = useState(new Set());
//   const [modalConfig, setModalConfig] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     type: 'info',
//     onConfirm: () => {}
//   });

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(
//     Number(searchParams.get('perPage')) || 10
//   );

//   // Filter state
//   const [filters, setFilters] = useState({
//     search: searchParams.get('search') || '',
//     status: searchParams.get('status') || 'all',
//     dateFrom: searchParams.get('dateFrom') || '',
//     dateTo: searchParams.get('dateTo') || ''
//   });

//   // Sort state
//   const [sort, setSort] = useState({
//     field: searchParams.get('sortField') || 'username',
//     direction: searchParams.get('sortDir') || 'asc'
//   });

//   // Statistics
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0
//   });

//   useEffect(() => {
//     loadUsers();
//   }, [currentPage, itemsPerPage, filters, sort]);

//   useEffect(() => {
//     // Update URL parameters
//     const params = {
//       page: currentPage,
//       perPage: itemsPerPage,
//       search: filters.search,
//       status: filters.status,
//       dateFrom: filters.dateFrom,
//       dateTo: filters.dateTo,
//       sortField: sort.field,
//       sortDir: sort.direction
//     };

//     setSearchParams(
//       Object.entries(params)
//         .filter(([, value]) => value)
//         .reduce((acc, [key, value]) => {
//           acc[key] = value;
//           return acc;
//         }, {})
//     );
//   }, [currentPage, itemsPerPage, filters, sort]);

//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       let filteredUsers = [...mockUsers];

//       // Apply filters
//       if (filters.search) {
//         const searchTerm = filters.search.toLowerCase();
//         filteredUsers = filteredUsers.filter(user => 
//           user.username.toLowerCase().includes(searchTerm) ||
//           user.email.toLowerCase().includes(searchTerm)
//         );
//       }

//       if (filters.status !== 'all') {
//         filteredUsers = filteredUsers.filter(user => 
//           user.status === filters.status
//         );
//       }

//       if (filters.dateFrom) {
//         filteredUsers = filteredUsers.filter(user =>
//           new Date(user.registrationDate) >= new Date(filters.dateFrom)
//         );
//       }

//       if (filters.dateTo) {
//         filteredUsers = filteredUsers.filter(user =>
//           new Date(user.registrationDate) <= new Date(filters.dateTo)
//         );
//       }

//       // Apply sorting
//       filteredUsers.sort((a, b) => {
//         const aValue = a[sort.field];
//         const bValue = b[sort.field];
        
//         if (sort.direction === 'asc') {
//           return aValue.localeCompare(bValue);
//         }
//         return bValue.localeCompare(aValue);
//       });

//       // Update statistics
//       setStats({
//         total: filteredUsers.length,
//         active: filteredUsers.filter(u => u.status === 'active').length,
//         inactive: filteredUsers.filter(u => u.status === 'inactive').length
//       });

//       // Apply pagination
//       const start = (currentPage - 1) * itemsPerPage;
//       const paginatedUsers = filteredUsers.slice(start, start + itemsPerPage);

//       setUsers(paginatedUsers);
//     } catch (error) {
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSort = (field) => {
//     setSort(prev => ({
//       field,
//       direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const handleStatusChange = async (userId, newStatus) => {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setUsers(prev => prev.map(user => 
//         user.id === userId ? { ...user, status: newStatus } : user
//       ));

//       toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
//     } catch (error) {
//       toast.error('Failed to update user status');
//     }
//   };

//   const handleDelete = async (userId) => {
//     setModalConfig({
//       isOpen: true,
//       title: 'Confirm Deletion',
//       message: 'Are you sure you want to delete this user? This action cannot be undone.',
//       type: 'danger',
//       onConfirm: async () => {
//         try {
//           // Simulate API call
//           await new Promise(resolve => setTimeout(resolve, 1000));
          
//           setUsers(prev => prev.filter(user => user.id !== userId));
//           toast.success('User deleted successfully');
//         } catch (error) {
//           toast.error('Failed to delete user');
//         }
//       }
//     });
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedUsers.size === 0) {
//       toast.error('Please select users first');
//       return;
//     }

//     setModalConfig({
//       isOpen: true,
//       title: `Confirm Bulk ${action}`,
//       message: `Are you sure you want to ${action} ${selectedUsers.size} users?`,
//       type: 'warning',
//       onConfirm: async () => {
//         try {
//           // Simulate API call
//           await new Promise(resolve => setTimeout(resolve, 1000));
          
//           setUsers(prev => prev.map(user => 
//             selectedUsers.has(user.id)
//               ? { ...user, status: action === 'activate' ? 'active' : 'inactive' }
//               : user
//           ));

//           setSelectedUsers(new Set());
//           toast.success(`${selectedUsers.size} users ${action}d successfully`);
//         } catch (error) {
//           toast.error(`Failed to ${action} users`);
//         }
//       }
//     });
//   };

//   const handleExport = async () => {
//     try {
//       // Generate CSV content
//       const headers = ['Username', 'Email', 'Status', 'Registration Date'];
//       const csvContent = [
//         headers.join(','),
//         ...users.map(user => [
//           user.username,
//           user.email,
//           user.status,
//           format(new Date(user.registrationDate), 'MM/dd/yyyy')
//         ].join(','))
//       ].join('\n');

//       // Create and download file
//       const blob = new Blob([csvContent], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Users exported successfully');
//     } catch (error) {
//       toast.error('Failed to export users');
//     }
//   };

//   return (
//     <div className="user-management">
//       <nav className="breadcrumbs" aria-label="Breadcrumb">
//         <ol>
//           <li>
//             <a href="/">
//               <Home size={16} />
//               <span>Home</span>
//             </a>
//           </li>
//           <li>
//             <span>Admin</span>
//           </li>
//           <li aria-current="page">
//             <span>User Management</span>
//           </li>
//         </ol>
//       </nav>

//       <div className="dashboard-header">
//         <h1>User Management</h1>
//         <div className="stats-cards">
//           <div className="stat-card">
//             <Users size={24} />
//             <div className="stat-content">
//               <span className="stat-label">Total Users</span>
//               <span className="stat-value">{stats.total}</span>
//             </div>
//           </div>
//           <div className="stat-card">
//             <UserCheck size={24} />
//             <div className="stat-content">
//               <span className="stat-label">Active Users</span>
//               <span className="stat-value">{stats.active}</span>
//             </div>
//           </div>
//           <div className="stat-card">
//             <UserX size={24} />
//             <div className="stat-content">
//               <span className="stat-label">Inactive Users</span>
//               <span className="stat-value">{stats.inactive}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="controls-section">
//         <div className="search-filters">
//           <div className="search-bar">
//             <Search size={20} />
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={filters.search}
//               onChange={(e) => setFilters(prev => ({
//                 ...prev,
//                 search: e.target.value
//               }))}
//             />
//           </div>

//           <div className="filters">
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters(prev => ({
//                 ...prev,
//                 status: e.target.value
//               }))}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>

//             <input
//               type="date"
//               value={filters.dateFrom}
//               onChange={(e) => setFilters(prev => ({
//                 ...prev,
//                 dateFrom: e.target.value
//               }))}
//               aria-label="From date"
//             />

//             <input
//               type="date"
//               value={filters.dateTo}
//               onChange={(e) => setFilters(prev => ({
//                 ...prev,
//                 dateTo: e.target.value
//               }))}
//               aria-label="To date"
//             />
//           </div>
//         </div>

//         <div className="actions">
//           <button
//             className="btn btn-secondary"
//             onClick={() => handleBulkAction('activate')}
//             disabled={selectedUsers.size === 0}
//           >
//             <UserCheck size={18} />
//             Activate Selected
//           </button>
//           <button
//             className="btn btn-secondary"
//             onClick={() => handleBulkAction('deactivate')}
//             disabled={selectedUsers.size === 0}
//           >
//             <UserX size={18} />
//             Deactivate Selected
//           </button>
//           <button
//             className="btn btn-primary"
//             onClick={handleExport}
//           >
//             <Download size={18} />
//             Export
//           </button>
//         </div>
//       </div>

//       <div className="table-container">
//         <table className="users-table">
//           <thead>
//             <tr>
//               <th>
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.size === users.length}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedUsers(new Set(users.map(u => u.id)));
//                     } else {
//                       setSelectedUsers(new Set());
//                     }
//                   }}
//                 />
//               </th>
//               <th onClick={() => handleSort('username')} className="sortable">
//                 Username
//                 {sort.field === 'username' ? (
//                   sort.direction === 'asc' ? (
//                     <ChevronUp size={16} />
//                   ) : (
//                     <ChevronDown size={16} />
//                   )
//                 ) : (
//                   <ArrowUpDown size={16} />
//                 )}
//               </th>
//               <th>Email</th>
//               <th>Status</th>
//               <th onClick={() => handleSort('registrationDate')} className="sortable">
//                 Registration Date
//                 {sort.field === 'registrationDate' ? (
//                   sort.direction === 'asc' ? (
//                     <ChevronUp size={16} />
//                   ) : (
//                     <ChevronDown size={16} />
//                   )
//                 ) : (
//                   <ArrowUpDown size={16} />
//                 )}
//               </th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="loading-cell">
//                   <Loader className="spinner" size={24} />
//                   <span>Loading users...</span>
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="empty-cell">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               users.map(user => (
//                 <tr key={user.id}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.has(user.id)}
//                       onChange={(e) => {
//                         const newSelected = new Set(selectedUsers);
//                         if (e.target.checked) {
//                           newSelected.add(user.id);
//                         } else {
//                           newSelected.delete(user.id);
//                         }
//                         setSelectedUsers(newSelected);
//                       }}
//                     />
//                   </td>
//                   <td>{user.username}</td>
//                   <td>{user.email}</td>
//                   <td>
//                     <span className={`status-badge ${user.status}`}>
//                       {user.status === 'active' ? (
//                         <CheckCircle size={16} />
//                       ) : (
//                         <AlertTriangle size={16} />
//                       )}
//                       {user.status}
//                     </span>
//                   </td>
//                   <td>
//                     {format(new Date(user.registrationDate), 'MM/dd/yyyy')}
//                   </td>
//                   <td className="actions-cell">
//                     {user.status === 'active' ? (
//                       <>
//                         <button
//                           className="btn btn-warning btn-sm"
//                           onClick={() => handleStatusChange(user.id, 'inactive')}
//                         >
//                           Deactivate
//                         </button>
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => handleDelete(user.id)}
//                         >
//                           Delete
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         className="btn btn-success btn-sm"
//                         onClick={() => handleStatusChange(user.id, 'active')}
//                       >
//                         Activate
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <div className="items-per-page">
//           <span>Show:</span>
//           <select
//             value={itemsPerPage}
//             onChange={(e) => {
//               setItemsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//           >
//             {ITEMS_PER_PAGE_OPTIONS.map(option => (
//               <option key={option} value={option}>{option}</option>
//             ))}
//           </select>
//         </div>

//         <div className="pagination-controls">
//           <button
//             className="btn btn-secondary"
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <span className="page-info">
//             Page {currentPage} of {Math.ceil(stats.total / itemsPerPage)}
//           </span>
//           <button
//             className="btn btn-secondary"
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             disabled={currentPage >= Math.ceil(stats.total / itemsPerPage)}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={modalConfig.isOpen}
//         onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
//         title={modalConfig.title}
//         message={modalConfig.message}
//         type={modalConfig.type}
//         onConfirm={modalConfig.onConfirm}
//       />
//     </div>
//   );
// };

// export default UserManagement;