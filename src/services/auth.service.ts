import type { AxiosResponse } from 'axios'
import api from './api'
import type { LoginRequest, AuthResponse, User } from '@/types/auth'

class AuthService {
  async login(credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/api/auth/login', credentials)
  }

  async getCurrentUser(): Promise<AxiosResponse<User>> {
    return api.get<User>('/api/auth/me')
  }

  async logout(): Promise<AxiosResponse<void>> {
    return api.post<void>('/api/auth/logout')
  }
}

export const authService = new AuthService()