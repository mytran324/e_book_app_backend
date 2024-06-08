export default class Exception extends Error {
  static USER_NOT_AUTHORIZED_OR_TOKEN_MISSING =
    "User is not authorized or token is missing!";
  static INVALID_EMAIL = "Invalid email";
  static RESET_PASSWORD_FAILED = "Reset password failed";
  static INVALID_PASSWORD =
    "Password must be at least 8 characters. Includes uppercase, lowercase letters and numbers.";
  static GET_USER_FAILED = "Get user failed";
  static ACCOUNT_DISABLED = "Account disabled";
  static CHANGED_PASSWORD_SUCCESS =
    "You have successfully changed your password";
  static CHANGED_PASSWORD_FAILED = "You have failed to change your password";
  static INCORRECT_PASS = "Incorrect password";
  static ACCOUNT_EXIST = "Account already exists";
  static CANNOT_REGISTER_ACCOUNT = "Can't register Account";
  static WRONG_EMAIL_OR_PASSWORD = "Wrong email or password";
  static LOGIN_FAILED = "Login failed";
  static LOGOUT_FAILED = "Logout failed";
  static UPDATE_USER_FAILED = "User information update failed";
  static GET_USER_FAILED = "Get user failed";
  static DELETE_USER_FAILED = "Delete user failed";
  static DELETE_USER_SUCCESS = "Delete user successfully";
}
