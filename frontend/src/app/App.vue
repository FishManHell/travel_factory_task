<script setup lang="ts">
import AppHeader from "@/app/ui/AppHeader.vue";
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import styles from './App.module.scss'
</script>

<template>
  <div :class="styles.app">
    <AppHeader />
    <main :class="styles.main">
      <router-view/>
    </main>
    <Toast/>
    <ConfirmDialog :closable="false" />
  </div>
</template>
