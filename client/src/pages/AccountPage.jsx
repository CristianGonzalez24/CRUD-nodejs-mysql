import './styles/AccountPage.css'

const AccountPage = () => {
  return (
    <div>AccountPage</div>
  )
}

export default AccountPage

// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { 
//   User, Mail, Calendar, Camera, Home, ChevronRight, 
//   Loader, AlertCircle, CheckCircle, LogOut 
// } from 'lucide-react';
// import ConfirmationModal from '../ConfirmationModal';
// import './AccountPage.css';

// const AccountPage = () => {
//   const { user, updateUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     notifications: user?.notifications || false
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState(null);
//   const [imagePreview, setImagePreview] = useState(user?.avatar || null);
//   const fileInputRef = useRef(null);
//   const formRef = useRef(null);

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
//       newErrors.phone = 'Please enter a valid phone number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setNotification({
//         type: 'error',
//         message: 'Please select an image file'
//       });
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       const firstError = formRef.current?.querySelector('[aria-invalid="true"]');
//       firstError?.focus();
//       return;
//     }

//     setIsSaving(true);

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       await updateUser({
//         ...formData,
//         avatar: imagePreview
//       });

//       setNotification({
//         type: 'success',
//         message: 'Profile updated successfully'
//       });
//       setIsEditing(false);
//     } catch (error) {
//       setNotification({
//         type: 'error',
//         message: 'Failed to update profile. Please try again.'
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       setNotification({
//         type: 'error',
//         message: 'Failed to log out. Please try again.'
//       });
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="account-page">
//       <div className="account-container">
//         {/* Breadcrumbs */}
//         <nav className="breadcrumbs" aria-label="Breadcrumb">
//           <ol>
//             <li>
//               <Link to="/" className="breadcrumb-link">
//                 <Home size={16} />
//                 <span>Home</span>
//               </Link>
//             </li>
//             <ChevronRight size={16} />
//             <li>
//               <span className="current" aria-current="page">My Account</span>
//             </li>
//           </ol>
//         </nav>

//         {notification && (
//           <div 
//             className={`notification ${notification.type}`}
//             role="alert"
//           >
//             {notification.type === 'success' ? (
//               <CheckCircle size={20} />
//             ) : (
//               <AlertCircle size={20} />
//             )}
//             <span>{notification.message}</span>
//             <button
//               className="close-notification"
//               onClick={() => setNotification(null)}
//               aria-label="Close notification"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         <div className="account-header">
//           <div className="profile-image-container">
//             <div 
//               className="profile-image"
//               onClick={handleImageClick}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   handleImageClick();
//                 }
//               }}
//             >
//               {imagePreview ? (
//                 <img 
//                   src={imagePreview} 
//                   alt={`${user.name}'s profile`} 
//                   className="avatar-image"
//                 />
//               ) : (
//                 <div className="avatar-placeholder">
//                   {user.name.charAt(0).toUpperCase()}
//                 </div>
//               )}
//               <div className="image-overlay">
//                 <Camera size={24} />
//                 <span>Change Photo</span>
//               </div>
//             </div>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               className="hidden"
//               aria-label="Upload profile picture"
//             />
//           </div>

//           <div className="account-info">
//             <h1>{user.name}</h1>
//             <p className="join-date">
//               <Calendar size={16} />
//               <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
//             </p>
//           </div>
//         </div>

//         <form 
//           ref={formRef}
//           onSubmit={handleSubmit} 
//           className="account-form"
//           noValidate
//         >
//           <div className="form-header">
//             <h2>Account Settings</h2>
//             <button
//               type="button"
//               className="edit-button"
//               onClick={() => setIsEditing(!isEditing)}
//             >
//               {isEditing ? 'Cancel' : 'Edit'}
//             </button>
//           </div>

//           <div className="form-grid">
//             <div className="form-group">
//               <label htmlFor="name">
//                 <User size={18} />
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className={errors.name ? 'error' : ''}
//                 aria-invalid={errors.name ? 'true' : 'false'}
//                 aria-describedby={errors.name ? 'name-error' : undefined}
//               />
//               {errors.name && (
//                 <span className="error-message" id="name-error" role="alert">
//                   <AlertCircle size={16} />
//                   {errors.name}
//                 </span>
//               )}
//             </div>

//             <div className="form-group">
//               <label htmlFor="email">
//                 <Mail size={18} />
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className={errors.email ? 'error' : ''}
//                 aria-invalid={errors.email ? 'true' : 'false'}
//                 aria-describedby={errors.email ? 'email-error' : undefined}
//               />
//               {errors.email && (
//                 <span className="error-message" id="email-error" role="alert">
//                   <AlertCircle size={16} />
//                   {errors.email}
//                 </span>
//               )}
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone">
//                 <Phone size={18} />
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className={errors.phone ? 'error' : ''}
//                 aria-invalid={errors.phone ? 'true' : 'false'}
//                 aria-describedby={errors.phone ? 'phone-error' : undefined}
//               />
//               {errors.phone && (
//                 <span className="error-message" id="phone-error" role="alert">
//                   <AlertCircle size={16} />
//                   {errors.phone}
//                 </span>
//               )}
//             </div>

//             <div className="form-group checkbox-group">
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="notifications"
//                   checked={formData.notifications}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//                 <span>Receive email notifications</span>
//               </label>
//             </div>
//           </div>

//           {isEditing && (
//             <div className="form-actions">
//               <button
//                 type="submit"
//                 className="btn btn-primary save-btn"
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader className="spinner" size={20} />
//                     <span>Saving...</span>
//                   </>
//                 ) : (
//                   'Save Changes'
//                 )}
//               </button>
//             </div>
//           )}
//         </form>

//         <div className="account-actions">
//           <button
//             onClick={() => setShowLogoutModal(true)}
//             className="btn btn-danger logout-btn"
//           >
//             <LogOut size={20} />
//             <span>Log Out</span>
//           </button>
//         </div>

//         <ConfirmationModal
//           isOpen={showLogoutModal}
//           onClose={() => setShowLogoutModal(false)}
//           onConfirm={handleLogout}
//           title="Confirm Logout"
//           message="Are you sure you want to log out? You will need to log in again to access your account."
//           type="warning"
//           confirmText="Log Out"
//           cancelText="Cancel"
//         />
//       </div>
//     </div>
//   );
// };

// export default AccountPage;