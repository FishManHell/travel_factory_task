<script setup lang="ts">
import type { VacationRequest } from "@/types/vacationRequest";
import { Dialog, Textarea, Button } from "primevue";
import { ref, watch } from "vue";
import styles from './RejectDialog.module.scss'

const props = defineProps<{
  visible: boolean
  request: VacationRequest | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [reason: string]
}>()

const reason = ref('')

watch(() => props.visible, (open) => {
  if (open) reason.value = ''
})

const onCancel = () => emit('update:visible', false)
const onConfirm = () => {
  emit('confirm', reason.value.trim())
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Reject request"
    :style="{ width: '30rem' }"
    :breakpoints="{ '960px': '75vw', '640px': '92vw' }"
  >
    <p v-if="request" :class="styles.summary">
      Reject request from <b>{{ request.user.name }}</b>
      for {{ request.startDate }} – {{ request.endDate }}?
    </p>

    <label :class="styles.label">Reason</label>
    <Textarea
      v-model="reason"
      rows="4"
      autoResize
      :class="styles.textarea"
      placeholder="Explain why this request is rejected"
    />

    <template #footer>
      <div :class="styles.footer">
        <Button label="Cancel" severity="secondary" @click="onCancel" />
        <Button
          label="Reject"
          severity="danger"
          :disabled="!reason.trim()"
          @click="onConfirm"
        />
      </div>
    </template>
  </Dialog>
</template>
