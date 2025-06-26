import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router";
import { useAuth } from '../hooks/useAuth.js';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import { 
  User, Mail, Calendar, Camera, Home, ChevronRight, 
  Loader, AlertCircle, CheckCircle, X, LogOut 
} from 'lucide-react';
import './styles/AccountPage.css'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { ENV } from '../config/ENV.js';

const AccountPage = () => {
  const { user, isLoading, logoutUser, uploadImage, deleteImage, updateUser } = useAuth();
  const showNotification = useNotification();

  if (isLoading) {
    return (
      <div className="loading-overlay" role="alert" aria-busy="true">
        <LoadingSpinner size={80} color="var(--primary-color)" />
      </div>
    );
  }

  const navigate = useNavigate();

  const [originalValues, setOriginalValues] = useState({
    username: user?.username || '',
    email: user?.email || ''
    // notifications: user?.notifications || false
  });

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
    // notifications: user?.notifications || false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUser, setImageUser] = useState(user?.avatar || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
  
    const initialValues = {
      username: user.username || '',
      email: user.email || ''
      // notifications: user.notifications || false
    };

    setOriginalValues(initialValues);
    setFormData(initialValues);
    setImageUser(user.avatar || null);
  }, [user, navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageClose = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);             
    }
  
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    const isImage = file.type.startsWith('image/');
    const maxSize = ENV.IMAGE_MAX_SIZE || 5;

    if (!file) return;

    if (!isImage) {
      showNotification({
        type: 'error',
        message: 'Only JPG, JPEG, PNG or WEBP images are allowed.',
        autoClose: true,
        position: 'top-center'
      })
      handleImageClose();
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      showNotification({
        type: 'error',
        message: `Please select an image file smaller than ${maxSize}MB.`,
        autoClose: true,
        position: 'top-center'
      })
      handleImageClose();
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  }

  const handleSubmitAvatar = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      showNotification({
        type: 'error',
        message: 'Please select an image before saving.',
        autoClose: true,
        position: 'top-center'
      })
      return;
    }

    const file = fileInputRef.current.files[0];

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const userId = user.id;
      const result = await uploadImage(userId, formData);

      if (result?.success) {
        showNotification({
          type: 'success',
          message: result.message,
          autoClose: true
        })
      } else {
        showNotification({
          type: 'error',
          message: result.error,
          autoClose: false
        })
      }
    } catch (error) {
      setErrors({ avatar: 'Failed to update avatar' });
    } finally {
      handleImageClose();
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      const result = await deleteImage(user.id);
      if (result?.success) {
        showNotification({
          type: 'success',
          message: result.message,
          autoClose: true
        })
      } else {
        showNotification({
          type: 'error',
          message: result.error,
          autoClose: false
        })
      }
    } catch (error) {
      setErrors({ avatar: 'Failed to delete avatar' });
    } finally {
      handleImageClose();
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }    
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
    //   newErrors.phone = 'Please enter a valid phone number';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    if (!validateForm()) {
      const firstError = formRef.current?.querySelector('[aria-invalid="true"]');
      firstError?.focus();
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateUser(user.id, formData);
      console.log('[handleSubmit] Resultado updateUser:', result);
      console.log('[handleSubmit] Enviando formData:', formData);

      if (result?.success) {
        showNotification({
          type: 'success',
          message: result.message,
          autoClose: true
        })
        setIsEditing(false);
        setErrors({});
        setFormData(originalValues);
      } else {
        showNotification({
          type: 'error',
          message: result.error,
          autoClose: false
        })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ ...originalValues });
      setErrors({});
    }
    setIsEditing(prev => !prev);
  }
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Failed to log out. Please try again.',
        autoClose: true
      })
    }
  }

  const isFormDirty = () => {
    return (
      formData.username !== originalValues.username ||
      formData.email !== originalValues.email
      // formData.notifications !== originalValues.notifications
      // formData.phone !== originalValues.phone ||
    );
  };
  
  return (
    <div className="account-page">
      <div className="account-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/" className="breadcrumb-link">
                <Home size={16} />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight size={16} />
            <li>
              <span className="current" aria-current="page">My Account</span>
            </li>
          </ol>
        </nav>

        <div className="account-header">
          <div className="profile-image-container">
            <div 
              className="profile-image"
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick();
                }
              }}
            >
              {imagePreview || imageUser ? (
                <img 
                src={imagePreview || imageUser}
                alt={`${user.username}'s profile`} 
                className="avatar-image"
                crossOrigin="anonymous"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="image-overlay">
                <Camera size={24} />
                <span>Change Photo</span>
              </div>
            </div>

            <div className="file-upload-container">
              <label htmlFor="avatar-upload" className="btn btn-primary">
                Select Image
              </label>
              <input
                id="avatar-upload"
                type="file"
                name="avatar"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden-input"
                aria-label="Upload profile picture"
              />
              {imageUser && !imagePreview &&
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                  aria-label="Delete current profile picture"
                  disabled={isLoading}
                >
                  Delete Image
                </button>
              } 
            </div>

            {imagePreview && (
              <div className="image-preview-menu">
                <span> Are you sure you want to change your profile picture?</span>
                <div className="image-preview-actions">
                  <button
                    type="button"
                    className="action-btn action-btn-primary"
                    onClick={handleSubmitAvatar} 
                    aria-label="Save profile picture"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn-danger"
                    onClick={handleImageClose}
                    aria-label="Close image preview"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="account-info">
            <h1>{user.username}</h1>
            <p className="join-date">
              <Calendar size={16} />
              <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </p>
          </div>
        </div>

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="account-form"
          noValidate
        >
          <div className="form-header-account">
            <h2>Account Settings</h2>
            <button
              type="button"
              className="action-btn action-btn-primary"
              disabled={!user}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="username">
                <User size={18} />
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={errors.username ? 'error' : ''}
                aria-invalid={errors.username ? 'true' : 'false'}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && (
                <span className="error-message" id="username-error" role="alert">
                  <AlertCircle size={16} />
                  {errors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={errors.email ? 'error' : ''}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span className="error-message" id="email-error" role="alert">
                  <AlertCircle size={16} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* <div className="form-group">
              <label htmlFor="phone">
                <Phone size={18} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={errors.phone ? 'error' : ''}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <span className="error-message" id="phone-error" role="alert">
                  <AlertCircle size={16} />
                  {errors.phone}
                </span>
              )}
            </div> */}

            {/* <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span>Receive email notifications</span>
              </label>
            </div> */}
          </div> 

          {isEditing && (
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary save-btn"
                disabled={isSaving || !isFormDirty()}
              >
                {isSaving ? (
                  <>
                    <Loader className="spinner" size={20} />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </form>

        <div className="account-actions">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="btn btn-danger logout-btn"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>

        <ConfirmationModal
          loading={isLoading}
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          title="Confirm Logout"
          message="Are you sure you want to log out? You will need to log in again to access your account."
          type="warning"
          confirmText="Log Out"
          cancelText="Cancel"
        />
        <ConfirmationModal
          loading={isLoading}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAvatar}
          title="Delete Profile Image"
          message="Are you sure you want to delete your profile image?"
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  )
}

export default AccountPage