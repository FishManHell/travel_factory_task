<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { AppRoutes, RoutePaths } from '@/router/types'
import { Button } from "primevue";
import styles from './AppHeader.module.scss'

const { currentUser, clearUser } = useCurrentUser()
const router = useRouter()

const onLogout = () => {
  clearUser()
  router.push(RoutePaths[AppRoutes.HOME])
}
</script>

<template>
  <header v-if="currentUser" :class="styles.header">
    <div :class="styles.title">Vacation Manager</div>
    <div :class="styles.user">
      <span :class="styles.userName">{{ currentUser.name }} ({{ currentUser.role }})</span>
      <Button label="Logout" severity="secondary" size="small" @click="onLogout" />
    </div>
  </header>
</template>
