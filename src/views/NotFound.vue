<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-icon size="120" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
        <h1 class="text-h1 font-weight-bold mt-4 mb-2">404</h1>
        <h2 class="text-h4 mb-4 text-medium-emphasis">Page Not Found</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-home"
          :to="{ name: 'Dashboard' }"
        >
          Back to Dashboard
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
