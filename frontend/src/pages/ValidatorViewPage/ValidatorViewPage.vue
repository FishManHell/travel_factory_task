<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { RequestStatus, VacationRequest } from "@/types/vacationRequest";
import { Button, Column, DataTable, Tag, Select } from "primevue";
import { FilterMatchMode } from '@primevue/core/api'
import { statusIcon, statusLabel, statusSeverity } from "@/shared/vacationRequest";
import { statusOptions } from "./model/statusOptions";
import RejectDialog from "./ui/RejectDialog.vue";
import { useConfirm } from 'primevue/useconfirm'
import { useRequests } from "@/composables/useRequests";
import styles from './ValidatorViewPage.module.scss'

const { requests, loading, loadRequests, approveRequest, rejectRequest } = useRequests()

const filters = ref({ status: { value: null, matchMode: FilterMatchMode.EQUALS } })
const isRejectOpen = ref(false)
const rejectingRequest = ref<VacationRequest | null>(null)
const confirm = useConfirm()

const openReject = (request: VacationRequest) => {
  rejectingRequest.value = request
  isRejectOpen.value = true
}

const onRejectConfirm = async (comments: string) => {
  if (!rejectingRequest.value) return
  const updated = await rejectRequest(rejectingRequest.value.id, comments)
  if (!updated) return
  await loadRequests()
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
      const updated = await approveRequest(request.id)
      if (!updated) return
      await loadRequests()
    },
  })
}

onMounted(() => loadRequests())

const getSeverity = (status: RequestStatus) => statusSeverity[status]
const getIcon = (status: RequestStatus) => statusIcon[status]
</script>

<template>
  <div>
    <h1 :class="styles.title">All vacation requests</h1>
    <div :class="styles.tableWrap">
      <DataTable
        v-model:filters="filters"
        :value="requests"
        :loading="loading"
        filterDisplay="row"
      >
        <template #empty>
          <span :class="styles.empty">No requests found</span>
        </template>
        <Column field="user.name" header="Requester" style="min-width: 10rem" />
        <Column field="startDate" header="Start date" style="min-width: 8rem" />
        <Column field="endDate" header="End date" style="min-width: 8rem" />
        <Column field="reason" header="Reason" style="min-width: 10rem">
          <template #body="{ data }: { data: VacationRequest }">
            {{ data.reason ?? '—' }}
          </template>
        </Column>
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
        <Column field="comments" header="Rejection comments" style="min-width: 10rem">
          <template #body="{ data }: { data: VacationRequest }">
            {{ data.comments ?? '—' }}
          </template>
        </Column>
        <Column header="Action" style="min-width: 7rem">
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
