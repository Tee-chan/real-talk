export interface AuthTokens {
  accessToken: string
}

export interface JwtPayload {
  sub: string
  email: string
  iat?: number
  exp?: number
}

export interface RegisterDto {
  email: string
  username: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}
