import toast from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

export const ToastUtils = {
  // Success notifications
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Error notifications
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Warning notifications
  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Info notifications
  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Loading notifications
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: '#6b7280',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Dismiss a specific toast
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },

  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      {
        ...defaultOptions,
        ...options,
      }
    );
  },
};

// Predefined toast messages for common actions
export const ToastMessages = {
  auth: {
    loginSuccess: 'Successfully logged in!',
    loginError: 'Login failed. Please check your credentials.',
    logoutSuccess: 'Successfully logged out!',
    logoutError: 'Logout failed. Please try again.',
    registerSuccess: 'Account created successfully!',
    registerError: 'Registration failed. Please try again.',
    passwordResetSent: 'Password reset email sent!',
    passwordResetError: 'Failed to send password reset email.',
    passwordChanged: 'Password changed successfully!',
    passwordChangeError: 'Failed to change password.',
  },
  profile: {
    updateSuccess: 'Profile updated successfully!',
    updateError: 'Failed to update profile.',
    avatarUploadSuccess: 'Avatar uploaded successfully!',
    avatarUploadError: 'Failed to upload avatar.',
  },
  files: {
    uploadSuccess: 'File uploaded successfully!',
    uploadError: 'Failed to upload file.',
    deleteSuccess: 'File deleted successfully!',
    deleteError: 'Failed to delete file.',
  },
  admin: {
    userCreated: 'User created successfully!',
    userUpdated: 'User updated successfully!',
    userDeleted: 'User deleted successfully!',
    userActionError: 'Failed to perform user action.',
  },
  general: {
    saveSuccess: 'Changes saved successfully!',
    saveError: 'Failed to save changes.',
    deleteSuccess: 'Item deleted successfully!',
    deleteError: 'Failed to delete item.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
  },
};
