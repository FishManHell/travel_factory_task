<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import {
  DatePicker,
  Button,
  Message,
  DataTable,
  Column,
  Tag,
  Textarea,
} from 'primevue'
import { requesterFormResolver } from './model/resolver'
import type { RequesterForm } from './model/types'
import type { RequestStatus, VacationRequest } from '@/types/vacationRequest'
import type { CreateRequestPayload } from '@/api/requests'
import { statusIcon, statusLabel, statusSeverity } from '@/shared/vacationRequest'
import { formatDate } from '@/shared/date'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useRequests } from '@/composables/useRequests'
import styles from './RequesterViewPage.module.scss'

const { currentUser } = useCurrentUser()
const { requests, loading, loadRequests, createRequest } = useRequests()

const initialValues: RequesterForm = {
  date: [null, null],
  reason: '',
}

const formKey = ref(0)

const buildPayload = (values: RequesterForm, userId: number): CreateRequestPayload | null => {
  const [start, end] = values.date
  if (!start || !end) return null
  return {
    userId,
    startDate: formatDate(start),
    endDate: formatDate(end),
    reason: values.reason?.trim() || null,
  }
}

const loadOwnRequests = () => loadRequests(currentUser.value?.id)

const onAdd = async (e: FormSubmitEvent) => {
  if (!e.valid || !currentUser.value) return

  const payload = buildPayload(e.values as RequesterForm, currentUser.value.id)
  if (!payload) return

  const created = await createRequest(payload)
  if (!created) return

  formKey.value++
  await loadOwnRequests()
}

onMounted(loadOwnRequests)

const getSeverity = (status: RequestStatus) => statusSeverity[status]
const getIcon = (status: RequestStatus) => statusIcon[status]
</script>

<template>
  <div>
    <h1 :class="styles.title">My vacation requests</h1>

    <h2 :class="styles.sectionTitle">New request</h2>
    <Form
      :key="formKey"
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

      <FormField name="reason" v-slot="$field" :class="styles.formField">
        <Textarea placeholder="Reason (optional)" rows="3" fluid autoResize />
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
      <DataTable :value="requests" :loading="loading" scrollable>
        <template #empty>
          <span>You have no requests yet</span>
        </template>
        <Column field="startDate" header="Start date" style="min-width: 9rem" />
        <Column field="endDate" header="End date" style="min-width: 9rem" />
        <Column field="reason" header="Reason" style="min-width: 12rem">
          <template #body="{ data }: { data: VacationRequest }">
            {{ data.reason ?? '—' }}
          </template>
        </Column>
        <Column field="status" header="Status" style="min-width: 9rem">
          <template #body="{ data } : { data: VacationRequest }">
            <Tag
              :value="statusLabel[data.status]"
              :severity="getSeverity(data.status)"
              :icon="getIcon(data.status)"
            />
          </template>
        </Column>
        <Column field="comments" header="Rejection comments" style="min-width: 14rem">
          <template #body="{ data }: { data: VacationRequest }">
            {{ data.comments ?? '—' }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
