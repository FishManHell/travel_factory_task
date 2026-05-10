<script setup lang="ts">
import { useCurrentUser } from "@/composables/useCurrentUser";
import { Column, DataTable, Button, Tag } from 'primevue'
import type { User } from "@/types/user";
import { useRouter } from "vue-router";
import { AppRoutes, RoutePaths } from "@/router";
import styles from './HomeViewPage.module.scss'

const { setUser } = useCurrentUser()
const router = useRouter()

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', role: 'Requester' },
  { id: 2, name: 'Bob Smith',     role: 'Requester' },
  { id: 3, name: 'Carol White',   role: 'Validator' },
  { id: 4, name: 'David Brown',   role: 'Validator' },
]

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
      <DataTable :value="mockUsers" dataKey="id" scrollable>
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
