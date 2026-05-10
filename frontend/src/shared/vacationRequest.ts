import type {RequestStatus} from "@/types/vacationRequest.ts";

export const statusSeverity: Record<RequestStatus, 'warn' | 'success' | 'danger'> = {
  pending: 'warn',
  approved: 'success',
  rejected: 'danger',
}

export const statusIcon: Record<RequestStatus, string> = {
  pending: 'pi pi-spin pi-spinner',
  approved: 'pi pi-check',
  rejected: 'pi pi-times',
}

export const statusLabel: Record<RequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}
