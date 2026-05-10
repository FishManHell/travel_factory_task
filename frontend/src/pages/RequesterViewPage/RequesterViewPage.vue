<script setup lang="ts">
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { DatePicker, Button, Message, DataTable, Column, Tag } from "primevue";
import { requesterFormResolver } from "./model/resolver";
import type { RequesterForm } from "./model/types";
import type { RequestStatus, VacationRequest } from "@/types/vacationRequest";
import { statusIcon, statusLabel, statusSeverity } from "@/shared/vacationRequest";
import styles from './RequesterViewPage.module.scss'

const initialValues: RequesterForm = {
  date: [null, null],
}

const onAdd = (e: FormSubmitEvent) => {
  if (!e.valid) return
  console.log(e.values)
}

const mockRequests: VacationRequest[] = [
  {
    id: 1,
    user: { id: 1, name: 'Alice Johnson' },
    startDate: '2026-06-01',
    endDate: '2026-06-07',
    status: 'pending',
    rejectionReason: null,
    createdAt: '2026-05-08T09:30:00.000Z',
  },
  {
    id: 2,
    user: { id: 1, name: 'Alice Johnson' },
    startDate: '2026-04-10',
    endDate: '2026-04-15',
    status: 'approved',
    rejectionReason: null,
    createdAt: '2026-03-20T14:12:00.000Z',
  },
]

const getSeverity = (status: RequestStatus) => statusSeverity[status]
const getIcon = (status: RequestStatus) => statusIcon[status]
</script>

<template>
  <div>
    <h1 :class="styles.title">My vacation requests</h1>

    <h2 :class="styles.sectionTitle">New request</h2>
    <Form
      :class="styles.form"
      :initialValues="initialValues"
      :resolver="requesterFormResolver"
      @submit="onAdd"
    >
      <FormField name="date" v-slot="$field" :class="styles.formField">
        <DatePicker dateFormat="dd/mm/yy" selectionMode="range" showIcon fluid />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
      <div :class="styles.formActions">
        <Button type="submit" label="Submit" />
      </div>
    </Form>

    <h2 :class="styles.sectionTitle">My requests</h2>
    <div :class="styles.tableWrap">
      <DataTable :value="mockRequests" scrollable>
        <template #empty>
          <span>You have no requests yet</span>
        </template>
        <Column field="startDate" header="Start date" style="min-width: 9rem" />
        <Column field="endDate" header="End date" style="min-width: 9rem" />
        <Column field="status" header="Status" style="min-width: 9rem">
          <template #body="{ data } : { data: VacationRequest }">
            <Tag
              :value="statusLabel[data.status]"
              :severity="getSeverity(data.status)"
              :icon="getIcon(data.status)"
            />
          </template>
        </Column>
        <Column field="rejectionReason" header="Rejection reason" style="min-width: 14rem">
          <template #body="{ data }: { data: VacationRequest }">
            {{ data.rejectionReason ?? '—' }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
