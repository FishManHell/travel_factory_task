import type {RequestStatus} from "@/types/vacationRequest.ts";

interface StatusOption {
  label: string;
  value: RequestStatus;
}

export const statusOptions: StatusOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]
