export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: number;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
}