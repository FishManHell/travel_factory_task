import { http } from './http'
import type { User } from '@/types/user'

export const getUsers = async (): Promise<User[]> => {
  const { data } = await http.get<User[]>('/users')
  return data
}
