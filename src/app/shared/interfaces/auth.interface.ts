export interface LoginResponse {
  status: string;
  token: string;
  data: {
    id: string;
    name: string;
  };
  role: string;
}
