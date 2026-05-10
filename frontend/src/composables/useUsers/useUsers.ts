import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { getUsers } from '@/api/users'
import type { User } from '@/types/user'

export const useUsers = () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const toast = useToast()

  const loadUsers = async () => {
    loading.value = true
    try {
      users.value = await getUsers()
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Failed to load users', life: 3000 })
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return { users, loading, loadUsers }
}
