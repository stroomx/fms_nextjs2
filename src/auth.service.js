import alert from '@/app/components/SweetAlerts';
import Cookies from 'js-cookie';


/**
 * Implementation can be changed to use cookies to enable usage with server side components.
 */

class AuthService {
  // Define the keys for user details and authentication token
  static USER_KEY = 'user_details';
  static TOKEN_KEY = 'auth_token';

  // Check if the user is authenticated by verifying the token in cookies
  static isAuthenticated() {
    return !!Cookies.get(AuthService.TOKEN_KEY);
  }

  // Retrieve stored user details from cookies
  static getUser() {
    const user = Cookies.get(AuthService.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Retrieve stored authentication token from cookies
  static getAuthToken() {
    return Cookies.get(AuthService.TOKEN_KEY);
  }

  // Login the user: store user details and authentication token in cookies
  static login(user, authToken, expiresIn = 1) {
    // Store user and token in cookies with an expiration time (in days)
    Cookies.set(AuthService.USER_KEY, JSON.stringify(user), { expires: expiresIn });
    Cookies.set(AuthService.TOKEN_KEY, authToken, { expires: expiresIn });
  }

  // Logout the user: clear user details and token from cookies
  static logout(showAlert = false) {
    Cookies.remove(AuthService.USER_KEY);
    Cookies.remove(AuthService.TOKEN_KEY);
    if (showAlert) alert("Logged Out Successfully");
  }

  // Optionally, you can implement an auto-logout if the token expires
  static autoLogout(expiryTimeInMs) {
    setTimeout(() => {
      AuthService.logout();
      alert('Session expired, please log in again.');
    }, expiryTimeInMs);
  }
}

export default AuthService;


//   // Example usage
//   if (AuthService.isAuthenticated()) {
//     console.log('User is authenticated');
//     console.log('User details:', AuthService.getUser());
//     console.log('Auth token:', AuthService.getAuthToken());
//   } else {
//     console.log('User is not authenticated');
//   }
  
//   // Login example
//   const user = { username: 'john_doe', email: 'john@example.com' };
//   const authToken = 'sample-jwt-token';
//   AuthService.login(user, authToken);
  
//   // Logout example
//   // AuthService.logout();
  
//   // Auto logout example after 1 hour (3600000 ms)
//   AuthService.autoLogout(3600000);
  