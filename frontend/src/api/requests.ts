import { http } from './http'
import type { VacationRequest } from '@/types/vacationRequest'

export interface CreateRequestPayload {
  userId: number
  startDate: string
  endDate: string
  reason?: string | null
}

export const getRequests = async (userId?: number): Promise<VacationRequest[]> => {
  const { data } = await http.get<VacationRequest[]>('/requests', {
    params: userId !== undefined ? { userId } : undefined,
  })
  return data
}

export const createRequest = async (payload: CreateRequestPayload): Promise<VacationRequest> => {
  const { data } = await http.post<VacationRequest>('/requests', payload)
  return data
}

export const approveRequest = async (id: number): Promise<VacationRequest> => {
  const { data } = await http.patch<VacationRequest>(`/requests/${id}/approve`)
  return data
}

export const rejectRequest = async (id: number, comments: string): Promise<VacationRequest> => {
  const { data } = await http.patch<VacationRequest>(`/requests/${id}/reject`, { comments })
  return data
}
