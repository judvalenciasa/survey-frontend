export interface User {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    roles: string[]
    active: boolean
  }
  
  export interface LoginRequest {
    username: string
    password: string
  }
  
  export interface AuthResponse {
    token: string
    user: User
  }
  
  export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
  }

  