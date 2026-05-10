<script setup lang="ts">
import { onMounted } from 'vue'
import { useCurrentUser } from "@/composables/useCurrentUser";
import { useUsers } from '@/composables/useUsers'
import { Column, DataTable, Button, Tag } from 'primevue'
import type { User } from "@/types/user";
import { useRouter } from "vue-router";
import { AppRoutes, RoutePaths } from "@/router";
import styles from './HomeViewPage.module.scss'

const { setUser } = useCurrentUser()
const { users, loading, loadUsers } = useUsers()
const router = useRouter()

onMounted(loadUsers)

const onSelect = (user: User) => {
  setUser(user)
  router.push(user.role === 'Validator'
    ? RoutePaths[AppRoutes.VALIDATOR] : RoutePaths[AppRoutes.REQUESTER]
  )
}
</script>

<template>
  <div>
    <h1 :class="styles.title">Choose a user</h1>
    <p :class="styles.subtitle">Select an account to sign in as</p>
    <div :class="styles.tableWrap">
      <DataTable :value="users" :loading="loading" dataKey="id" scrollable>
        <template #empty>
          <span>No users found</span>
        </template>
        <Column field="name" header="Name" style="min-width: 12rem" />
        <Column field="role" header="Role" style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :value="data.role" :severity="data.role === 'Validator' ? 'info' : 'success'" />
          </template>
        </Column>
        <Column header="Action" style="min-width: 8rem">
          <template #body="{ data }">
            <Button label="Login as" size="small" @click="onSelect(data)"/>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
