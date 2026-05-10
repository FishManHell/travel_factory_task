import type {User} from "./user";

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface VacationRequest {
  id: number
  user: Omit<User, 'role'>
  startDate: string
  endDate: string
  status: RequestStatus
  rejectionReason: string | null
  createdAt: string
}
