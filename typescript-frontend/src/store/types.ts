export interface user {
  id?: string;
  name?: string;
  last_name?: string;
  email?: string;
  image_path?: string;
  contact?: string;
}

export interface loginState {
  token: string;
  user: user;
  isAuth: boolean;
  loginInProgress: boolean;
  errorLogin: any;
}

export interface forgotPassword {
  isfetchingOtp: boolean;
  otpSet: object | null | any;
  error: string;
  isSendingOtp: boolean;
  isResetPasswordInProgress: boolean;
  correctOtp: boolean;
  resetPasswordSuccess: boolean;
  isremovingOtp: boolean;
}
