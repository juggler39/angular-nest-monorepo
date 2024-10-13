export interface AuthModel {
  email: string;
  password: string;
}


export interface AuthResponseData {
  iserId: string;
  accessToken: string;
  refreshToken: string
}
