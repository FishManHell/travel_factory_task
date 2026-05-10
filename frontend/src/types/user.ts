
export type Role = 'Requester' | 'Validator'

export interface User {
  id: number;
  name: string;
  role: Role
}
