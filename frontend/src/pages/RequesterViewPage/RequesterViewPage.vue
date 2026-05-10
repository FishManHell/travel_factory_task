<script setup lang="ts">
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { DatePicker, Button, Message, DataTable, Column, Tag } from "primevue";
import {requesterFormResolver} from "./model/resolver";
import type {RequesterForm} from "./model/types";
import type {RequestStatus, VacationRequest} from "@/types/vacationRequest";

const statusSeverity = {
  pending: 'warn',
  approved: 'success',
  rejected: 'danger',
} as const


const statusIcon = {
  pending: 'pi pi-spin pi-spinner',
  approved: 'pi pi-check',
  rejected: 'pi pi-times',
} as const

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
    <Form
      :initialValues="initialValues"
      @submit="onAdd"
      :resolver="requesterFormResolver"
    >
      <FormField name="date" v-slot="$field">
        <DatePicker dateFormat="dd/mm/yy" selectionMode="range" showIcon/>
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
      <Button type="submit" label="Submit"/>
    </Form>


    <DataTable :value="mockRequests">
      <template #empty>
        <h1>No data</h1>
      </template>
      <Column field="startDate" header="Start date" />
      <Column field="endDate" header="End date" />
      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag
            :value="data.status"
            :severity="getSeverity(data.status)"
            :icon="getIcon(data.status)"

          />
        </template>
      </Column>
      <Column field="rejectionReason" header="Rejection reason">
        <template #body="{ data }: { data: VacationRequest }">
          {{ data.rejectionReason ?? '—' }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
