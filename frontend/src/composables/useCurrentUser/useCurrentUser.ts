import { ref } from 'vue'
import type {User} from "@/types/user";

const STORAGE_KEY = 'currentUser'

const readUser = (): User | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

const currentUser = ref<User | null>(readUser())

export const useCurrentUser = () => {
  const setUser = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    currentUser.value = user
  }

  const clearUser = () => {
    localStorage.removeItem(STORAGE_KEY)
    currentUser.value = null
  }

  return { currentUser, setUser, clearUser }
}
