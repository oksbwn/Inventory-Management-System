<template>
  <BaseCard variant="default" elevation="0" class="stat-card">
    <div class="pa-4">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="stat-icon-wrapper" :class="`${gradient}-gradient`">
          <v-icon color="white" size="20">{{ icon }}</v-icon>
        </div>
        <v-chip size="small" :color="color" variant="tonal">{{ label }}</v-chip>
      </div>
      <div class="text-h6 font-weight-bold">{{ value }}</div>
      <div class="text-caption text-medium-emphasis">{{ subtitle }}</div>
    </div>
  </BaseCard>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  gradient: {
    type: String,
    enum: ['primary', 'success', 'grey', 'info', 'warning', 'error'],
    default: 'primary'
  }
})
</script>

<style scoped>
.stat-card {
  border: 1px solid #e8edf2;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border-color: #d0d7de;
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.success-gradient {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.grey-gradient {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.warning-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.error-gradient {
  background: linear-gradient(135deg, #f44336 0%, #e57373 100%);
}
</style>
