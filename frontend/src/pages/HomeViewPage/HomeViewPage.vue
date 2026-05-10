<script setup lang="ts">

import {useCurrentUser} from "@/composables/useCurrentUser";
import { Column, DataTable, Button, Tag } from 'primevue'
import type {CurrentUser} from "@/composables/useCurrentUser/model/types.ts";
import {useRouter} from "vue-router";
import {AppRoutes, RoutePaths} from "@/router";

const { setUser } = useCurrentUser()
const router = useRouter()

const mockUsers: CurrentUser[] = [
  { id: 1, name: 'Alice Johnson', role: 'Requester' },
  { id: 2, name: 'Bob Smith',     role: 'Requester' },
  { id: 3, name: 'Carol White',   role: 'Validator' },
  { id: 4, name: 'David Brown',   role: 'Validator' },
]

const onSelect = (user: CurrentUser) => {
  setUser(user)
  router.push(user.role === 'Validator'
    ? RoutePaths[AppRoutes.VALIDATOR] : RoutePaths[AppRoutes.REQUESTER]
  )
}

</script>

<template>
  <div>
    <h1>Choose a user</h1>
    <p class="subtitle">Select an account to sign in as</p>
    <DataTable :value="mockUsers">
      <template #empty>
        <h1>No users found</h1>
      </template>
      <Column field="name" header="Name" />
      <Column field="role" header="Role">
        <template #body="{ data }">
          <Tag :value="data.role" :severity="data.role === 'Validator' ? 'info' : 'success'" />
        </template>
      </Column>
      <Column header="Action">
        <template #body="{ data }">
          <Button label="Login as" @click="onSelect(data)"/>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
