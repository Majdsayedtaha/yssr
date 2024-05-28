export interface IUser {
  id: string;
  phoneNumber: number;
  token: string;
  password: string;
  newPassword: string;
  code: string;
  email: string;
  userNameOrEmail: string;
  getToken(): string;
  setToken(): void;
}
