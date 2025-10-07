<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Inventory Management System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-cube-outline" title="Stocks" to="/stocks"></v-list-item>
        <v-list-item prepend-icon="mdi-shape" title="Categories" to="/categories"></v-list-item>
        <v-list-item prepend-icon="mdi-package-variant" title="Boxes" to="/boxes"></v-list-item>
        <v-list-item prepend-icon="mdi-briefcase" title="Projects" to="/projects"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Vendors" to="/vendors"></v-list-item>
        <!-- Add this to your navigation items -->
<v-list-item
  prepend-icon="mdi-cog"
  title="Settings"
  value="settings"
  :to="{ name: 'Settings' }"
></v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(true)
</script>
