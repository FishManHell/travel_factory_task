import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  approveRequest as apiApproveRequest,
  createRequest as apiCreateRequest,
  getRequests as apiGetRequests,
  rejectRequest as apiRejectRequest,
  type CreateRequestPayload,
} from '@/api/requests'
import type { VacationRequest } from '@/types/vacationRequest'

export const useRequests = () => {
  const requests = ref<VacationRequest[]>([])
  const loading = ref(false)
  const toast = useToast()

  const loadRequests = async (userId?: number) => {
    loading.value = true
    try {
      requests.value = await apiGetRequests(userId)
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Failed to load requests', life: 3000 })
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const createRequest = async (payload: CreateRequestPayload): Promise<VacationRequest | null> => {
    try {
      const created = await apiCreateRequest(payload)
      toast.add({ severity: 'success', summary: 'Request submitted', life: 3000 })
      return created
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Failed to submit request', life: 3000 })
      console.error(e)
      return null
    }
  }

  const approveRequest = async (id: number): Promise<VacationRequest | null> => {
    try {
      const updated = await apiApproveRequest(id)
      toast.add({ severity: 'success', summary: 'Request approved', life: 3000 })
      return updated
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Failed to approve request', life: 3000 })
      console.error(e)
      return null
    }
  }

  const rejectRequest = async (id: number, comments: string): Promise<VacationRequest | null> => {
    try {
      const updated = await apiRejectRequest(id, comments)
      toast.add({ severity: 'success', summary: 'Request rejected', life: 3000 })
      return updated
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Failed to reject request', life: 3000 })
      console.error(e)
      return null
    }
  }

  return {
    requests,
    loading,
    loadRequests,
    createRequest,
    approveRequest,
    rejectRequest,
  }
}
