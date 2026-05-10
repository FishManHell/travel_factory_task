<script setup lang="ts">
import { ref } from "vue";
import type { RequestStatus, VacationRequest } from "@/types/vacationRequest";
import { Button, Column, DataTable, Tag, Select } from "primevue";
import { FilterMatchMode } from '@primevue/core/api'
import { statusIcon, statusLabel, statusSeverity } from "@/shared/vacationRequest";
import { statusOptions } from "./model/statusOptions";
import RejectDialog from "./ui/RejectDialog.vue";
import { useConfirm } from 'primevue/useconfirm'
import styles from './ValidatorViewPage.module.scss'

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
  {
    id: 3,
    user: { id: 1, name: 'Alice Johnson' },
    startDate: '2026-04-10',
    endDate: '2026-04-15',
    status: 'rejected',
    rejectionReason: null,
    createdAt: '2026-03-20T14:12:00.000Z',
  },
]

const filters = ref({status: { value: null, matchMode: FilterMatchMode.EQUALS }})
const isRejectOpen = ref(false)
const rejectingRequest = ref<VacationRequest | null>(null)
const confirm = useConfirm()

const openReject = (request: VacationRequest) => {
  rejectingRequest.value = request
  isRejectOpen.value = true
}

const onRejectConfirm = async (reason: string) => {
  if (!rejectingRequest.value) return
  // await rejectRequestAsync(rejectingRequest.value.id, reason)
  // refetch + toast
}

const onApprove = (request: VacationRequest) => {
  confirm.require({
    message: `Approve request from ${request.user.name}?`,
    header: 'Confirm approval',
    icon: 'pi pi-check-circle',
    acceptLabel: 'Approve',
    rejectLabel: 'Cancel',
    acceptProps: { severity: 'success' },
    accept: async () => {
      // await approveRequestAsync(request.id)
      // refetch + toast
    },
  })
}

const getSeverity = (status: RequestStatus) => statusSeverity[status]
const getIcon = (status: RequestStatus) => statusIcon[status]
</script>

<template>
  <div>
    <h1 :class="styles.title">All vacation requests</h1>
    <div :class="styles.tableWrap">
      <DataTable v-model:filters="filters" :value="mockRequests" filterDisplay="row">
        <template #empty>
          <span :class="styles.empty">No requests found</span>
        </template>
        <Column field="user.name" header="Requester" style="min-width: 10rem" />
        <Column field="startDate" header="Start date" style="min-width: 8rem" />
        <Column field="endDate" header="End date" style="min-width: 8rem" />
        <Column field="status" header="Status" :showFilterMenu="false" style="min-width: 9rem">
          <template #body="{ data }: { data: VacationRequest }">
            <Tag :value="statusLabel[data.status]" :severity="getSeverity(data.status)" :icon="getIcon(data.status)" />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select
              v-model="filterModel.value"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All"
              :showClear="true"
              @change="filterCallback()"
            />
          </template>
        </Column>
        <Column field="rejectionReason" header="Rejection reason" style="min-width: 12rem">
          <template #body="{ data }: { data: VacationRequest }">
            {{ data.rejectionReason ?? '—' }}
          </template>
        </Column>
        <Column header="Action" style="min-width: 11rem">
          <template #body="{ data }">
            <div :class="styles.actions" v-if="data.status === 'pending'">
              <Button label="Approve" severity="success" size="small" @click="onApprove(data)"/>
              <Button label="Reject" severity="danger" size="small" @click="openReject(data)"/>
            </div>
            <span v-else>—</span>
          </template>
        </Column>
      </DataTable>
    </div>
    <RejectDialog
      v-model:visible="isRejectOpen"
      :request="rejectingRequest"
      @confirm="onRejectConfirm"
    />
  </div>
</template>
