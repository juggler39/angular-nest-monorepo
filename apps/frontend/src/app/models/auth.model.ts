export interface AuthModel {
  username: string;
  password: string;
}


export interface AuthResponseData {
  iserId: string;
  accessToken: string;
  refreshToken: string
}
