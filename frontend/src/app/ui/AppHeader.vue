<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { AppRoutes, RoutePaths } from '@/router/types'
import { Button} from "primevue";

const { currentUser, clearUser } = useCurrentUser()
const router = useRouter()

const onLogout = () => {
  clearUser()
  router.push(RoutePaths[AppRoutes.HOME])
}

</script>

<template>
  <header class="app-header" v-if="currentUser">
    <div class="title">Vacation Manager</div>
    <div class="user-info">
      <span>{{ currentUser.name }} ({{ currentUser.role }})</span>
      <Button label="Logout" severity="secondary" size="small" @click="onLogout" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
