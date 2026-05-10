import { ref } from 'vue'
import type {CurrentUser} from "./model/types";

const STORAGE_KEY = 'currentUser'

const readUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

const currentUser = ref<CurrentUser | null>(readUser())

export const useCurrentUser = () => {
  const setUser = (user: CurrentUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    currentUser.value = user
  }

  const clearUser = () => {
    localStorage.removeItem(STORAGE_KEY)
    currentUser.value = null
  }

  return { currentUser, setUser, clearUser }
}
