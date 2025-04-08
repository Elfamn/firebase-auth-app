export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later';
    case 'auth/invalid-email':
      return 'Invalid email format';
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    default:
      return 'An error occurred during authentication';
  }
};