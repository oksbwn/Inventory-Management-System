<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              <v-icon size="32" class="mr-2">mdi-cog</v-icon>
              Settings
            </h1>
            <p class="text-body-2 text-medium-emphasis ml-11">
              Customize your inventory management experience
            </p>
          </div>
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-restore"
            @click="showResetDialog = true"
          >
            Reset to Defaults
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <!-- Appearance Settings -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-lg mb-6">
          <v-card-title class="pa-5 pb-3 d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-palette</v-icon>
            <span class="text-h6">Appearance</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <!-- Dark Mode Toggle -->
            <div class="setting-item mb-5">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-medium mb-1">
                    <v-icon class="mr-2">mdi-brightness-6</v-icon>
                    Dark Mode
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Switch between light and dark theme
                  </div>
                </div>
                <v-switch
                  v-model="settingsStore.darkMode"
                  color="primary"
                  hide-details
                  @change="handleDarkModeToggle"
                ></v-switch>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Compact Mode -->
            <div class="setting-item">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-medium mb-1">
                    <v-icon class="mr-2">mdi-view-compact</v-icon>
                    Compact Mode
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Reduce spacing for more content
                  </div>
                </div>
                <v-switch
                  v-model="settingsStore.compactMode"
                  color="primary"
                  hide-details
                  @change="settingsStore.toggleCompactMode"
                ></v-switch>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Data & Performance -->
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="pa-5 pb-3 d-flex align-center">
            <v-icon class="mr-3" color="success">mdi-database</v-icon>
            <span class="text-h6">Data & Performance</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <!-- Items Per Page -->
            <div class="setting-item mb-5">
              <div class="text-subtitle-1 font-weight-medium mb-3">
                <v-icon class="mr-2">mdi-table-row</v-icon>
                Default Items Per Page
              </div>
              <v-slider
                v-model="settingsStore.itemsPerPage"
                :min="5"
                :max="50"
                :step="5"
                thumb-label
                color="success"
                @update:model-value="settingsStore.setItemsPerPage"
              >
                <template v-slot:append>
                  <v-chip size="small" color="success">
                    {{ settingsStore.itemsPerPage }}
                  </v-chip>
                </template>
              </v-slider>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Cache Timeout -->
            <div class="setting-item">
              <div class="text-subtitle-1 font-weight-medium mb-3">
                <v-icon class="mr-2">mdi-timer-sand</v-icon>
                Cache Timeout (minutes)
              </div>
              <v-slider
                v-model="settingsStore.cacheTimeout"
                :min="1"
                :max="30"
                :step="1"
                thumb-label
                color="success"
                @update:model-value="settingsStore.setCacheTimeout"
              >
                <template v-slot:append>
                  <v-chip size="small" color="success">
                    {{ settingsStore.cacheTimeout }}m
                  </v-chip>
                </template>
              </v-slider>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Notifications & Auto-Refresh -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-lg mb-6">
          <v-card-title class="pa-5 pb-3 d-flex align-center">
            <v-icon class="mr-3" color="info">mdi-bell</v-icon>
            <span class="text-h6">Notifications</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <!-- Show Notifications -->
            <div class="setting-item mb-5">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-medium mb-1">
                    <v-icon class="mr-2">mdi-bell-ring</v-icon>
                    Enable Notifications
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Show success and error messages
                  </div>
                </div>
                <v-switch
                  v-model="settingsStore.showNotifications"
                  color="info"
                  hide-details
                  @change="settingsStore.toggleNotifications"
                ></v-switch>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Auto-Refresh Settings -->
        <v-card elevation="2" class="rounded-lg mb-6">
          <v-card-title class="pa-5 pb-3 d-flex align-center">
            <v-icon class="mr-3" color="orange">mdi-refresh</v-icon>
            <span class="text-h6">Auto-Refresh</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <!-- Auto Refresh Toggle -->
            <div class="setting-item mb-5">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-medium mb-1">
                    <v-icon class="mr-2">mdi-autorenew</v-icon>
                    Enable Auto-Refresh
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Automatically refresh data
                  </div>
                </div>
                <v-switch
                  v-model="settingsStore.autoRefresh"
                  color="orange"
                  hide-details
                  @change="settingsStore.toggleAutoRefresh"
                ></v-switch>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Refresh Interval -->
            <div class="setting-item">
              <div class="text-subtitle-1 font-weight-medium mb-3">
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                Refresh Interval (seconds)
              </div>
              <v-slider
                v-model="settingsStore.refreshInterval"
                :min="10"
                :max="300"
                :step="10"
                :disabled="!settingsStore.autoRefresh"
                thumb-label
                color="orange"
                @update:model-value="settingsStore.setRefreshInterval"
              >
                <template v-slot:append>
                  <v-chip size="small" color="orange">
                    {{ settingsStore.refreshInterval }}s
                  </v-chip>
                </template>
              </v-slider>
            </div>
          </v-card-text>
        </v-card>

        <!-- App Info -->
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="pa-5 pb-3 d-flex align-center">
            <v-icon class="mr-3" color="purple">mdi-information</v-icon>
            <span class="text-h6">About</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <v-list class="py-0 bg-transparent">
              <v-list-item class="px-0">
                <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">
                  Application Name
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-1 font-weight-medium">
                  Inventory Management System
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0">
                <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">
                  Version
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-1 font-weight-medium">
                  1.0.0
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0">
                <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">
                  Framework
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-1 font-weight-medium">
                  Vue 3 + Vuetify 3 + Vite
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0">
                <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">
                  Backend
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-1 font-weight-medium">
                  n8n Workflow Automation
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reset Confirmation Dialog -->
    <v-dialog v-model="showResetDialog" max-width="450px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 pb-4">
          <div class="d-flex align-center">
            <v-icon color="warning" size="32" class="mr-3">mdi-alert</v-icon>
            <span class="text-h5 font-weight-bold">Reset Settings?</span>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <p class="text-body-1 mb-3">
            Are you sure you want to reset all settings to their default values?
          </p>
          <v-alert type="warning" variant="tonal" density="compact">
            This action cannot be undone.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6 pt-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            size="large"
            @click="showResetDialog = false"
            class="text-none px-6"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            size="large"
            @click="handleReset"
            class="text-none px-6"
          >
            Reset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      :timeout="3000"
      color="success"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        {{ successMessage }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useSettingsStore } from '@/stores/settingsStore'

const theme = useTheme()
const settingsStore = useSettingsStore()

const showResetDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')

// Handle dark mode toggle
const handleDarkModeToggle = () => {
  theme.global.name.value = settingsStore.darkMode ? 'dark' : 'light'
  showSuccess('Theme updated successfully')
}

// Handle reset
const handleReset = () => {
  settingsStore.resetToDefaults()
  theme.global.name.value = 'light'
  showResetDialog.value = false
  showSuccess('Settings reset to defaults')
}

const showSuccess = (message) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}
</script>

<style scoped>
.setting-item {
  transition: all 0.2s ease;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
