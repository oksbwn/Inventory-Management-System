<!-- PROJECT DETAIL COMPONENT - COMPACT & PROFESSIONAL -->
<template>
  <v-container fluid class="project-detail-page">
    <!-- Back Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack" aria-label="Back to Projects">
          Back to Projects
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" justify="center" class="py-12">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary" width="3" />
        <div class="mt-4 text-h6 text-medium-emphasis">Loading project...</div>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="py-12">
      <v-col cols="12" class="text-center">
        <v-icon size="120" color="error">mdi-alert-circle-outline</v-icon>
        <h3 class="text-h5 font-weight-bold mt-4 mb-2">Project Not Found</h3>
        <p class="text-body-2 text-medium-emphasis mb-6">{{ error }}</p>
        <v-btn color="primary" @click="goBack" aria-label="Go Back">Go Back</v-btn>
      </v-col>
    </v-row>

    <!-- Project Details -->
    <div v-else-if="project">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="0" class="header-card">
            <v-card-text class="pa-6">
              <div class="d-flex align-center justify-space-between flex-wrap ga-4">
                <div class="d-flex align-center ga-4 flex-1-1">
                  <v-avatar :color="project.is_yt_project ? 'red' : 'indigo'" size="72">
                    <v-icon size="40" color="white">
                      {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                    </v-icon>
                  </v-avatar>

                  <div class="flex-1-1">
                    <!-- Editable Project Name -->
                    <div v-if="editingField === 'project_name'" class="mb-2">
                      <v-text-field v-model="editForm.project_name" density="comfortable" variant="outlined"
                        hide-details autofocus @blur="saveField('project_name')"
                        @keyup.enter="saveField('project_name')" @keyup.esc="cancelEdit"
                        aria-label="Edit Project Name" />
                    </div>
                    <h1 v-else class="text-h4 font-weight-bold mb-2 editable-field" @click="startEdit('project_name')"
                      tabindex="0" role="button" aria-label="Project Name, click to edit">
                      {{ project.project_name }}
                      <v-icon size="20" class="ml-2 edit-icon">mdi-pencil</v-icon>
                    </h1>

                    <div class="d-flex align-center ga-2 flex-wrap">
                      <!-- Editable Status -->
                      <div v-if="editingField === 'status'">
                        <v-select v-model="editForm.status" :items="statusOptions" density="comfortable"
                          variant="outlined" hide-details style="min-width: 150px" @blur="saveField('status')"
                          @update:model-value="saveField('status')" aria-label="Edit Status" />
                      </div>
                      <v-chip v-else :color="getStatusColor(project.status)" size="small" variant="elevated"
                        class="editable-chip" @click="startEdit('status')" tabindex="0" role="button"
                        aria-label="Project Status, click to edit">
                        {{ project.status || 'Not Set' }}
                        <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                      </v-chip>

                      <v-chip v-if="project.is_yt_project" color="red" size="small" variant="outlined">
                        <v-icon size="16" class="mr-1">mdi-youtube</v-icon>
                        YouTube Project
                      </v-chip>

                      <v-chip color="indigo" size="small" variant="outlined">
                        <v-icon size="16" class="mr-1">mdi-chip</v-icon>
                        {{ project.component_count || 0 }} Components
                      </v-chip>

                      <v-chip color="green" size="small" variant="outlined">
                        <v-icon size="16" class="mr-1">mdi-currency-inr</v-icon>
                        {{ formatCurrency(project.total_cost || 0) }}
                      </v-chip>
                    </div>
                  </div>
                </div>

                <div class="d-flex ga-2">
                  <v-btn color="error" prepend-icon="mdi-delete" variant="outlined" @click="deleteProject"
                    aria-label="Delete Project">
                    Delete
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content -->
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="8">
          <!-- Description Section -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon size="24" class="mr-2">mdi-text-box</v-icon>
                  <span class="text-h6 font-weight-bold">Description</span>
                </div>
                <v-btn size="small" variant="text" prepend-icon="mdi-pencil" @click="startEdit('description')"
                  aria-label="Edit Description">
                  Edit
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div v-if="editingField === 'description'">
                <v-textarea v-model="editForm.description" variant="outlined" rows="6"
                  placeholder="Enter project description..." hide-details aria-label="Edit Description Textarea" />
                <div class="d-flex ga-2 mt-4">
                  <v-btn color="primary" @click="saveField('description')">Save</v-btn>
                  <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>
                </div>
              </div>
              <div v-else>
                <div v-if="project.description" class="description-content">
                  {{ project.description }}
                </div>
                <div v-else class="text-medium-emphasis">No description provided</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Timeline Section -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-timeline-clock</v-icon>
                <span class="text-h6 font-weight-bold">Project Timeline</span>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-timeline side="end" density="compact" class="custom-timeline">
                <v-timeline-item dot-color="primary" size="small" icon="mdi-calendar-start">
                  <div class="d-flex justify-space-between align-center">
                    <strong>Project Started</strong>
                    <span class="text-caption text-medium-emphasis editable-date" @click="startEdit('start_date')"
                      tabindex="0" role="button" aria-label="Edit start date">
                      {{ formatDate(project.start_date) }}
                      <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                    </span>
                  </div>
                </v-timeline-item>

                <v-timeline-item v-if="project.status === 'Completed'" dot-color="success" size="small"
                  icon="mdi-check-circle">
                  <div class="d-flex justify-space-between align-center">
                    <strong>Project Completed</strong>
                    <span class="text-caption text-medium-emphasis editable-date" @click="startEdit('end_date')"
                      tabindex="0" role="button" aria-label="Edit end date">
                      {{ formatDate(project.end_date) }}
                      <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                    </span>
                  </div>
                </v-timeline-item>

                <v-timeline-item v-else dot-color="orange" size="small" icon="mdi-calendar-end">
                  <div class="d-flex justify-space-between align-center">
                    <strong>Target End Date</strong>
                    <span class="text-caption text-medium-emphasis editable-date" @click="startEdit('end_date')"
                      tabindex="0" role="button" aria-label="Edit target end date">
                      {{ formatDate(project.end_date) }}
                      <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                    </span>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>

          <!-- YouTube Video Details -->
          <v-card v-if="project.is_yt_project" elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2" color="red">mdi-youtube</v-icon>
                <span class="text-h6 font-weight-bold">YouTube Video Details</span>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-text-field v-model="videoInfo.title" label="Video Title" variant="outlined" density="comfortable"
                @blur="saveVideoField('title')" aria-label="Video Title" />

              <div class="mb-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-semibold">Video Description</span>
                  <v-btn size="small" variant="text" @click="toggleEditing('description')"
                    aria-label="Toggle Description Edit">
                    {{ editingVideoField === 'description' ? 'Cancel' : 'Edit' }}
                  </v-btn>
                </div>
                <div v-if="editingVideoField === 'description'">
                  <QuillEditor v-model:content="videoInfo.description" :toolbar="editorToolbar" theme="snow" contentType="html"
                    style="min-height: 150px" />
                  <div class="mt-2">
                    <v-btn size="small" color="primary" @click="saveVideoField('description')">Save</v-btn>
                  </div>
                </div>
                <div v-else v-html="videoInfo.description || '<em>No description provided</em>'" class="rich-content" />
              </div>

              <div class="mb-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-semibold">Video Script</span>
                  <v-btn size="small" variant="text" @click="toggleEditing('script')" aria-label="Toggle Script Edit">
                    {{ editingVideoField === 'script' ? 'Cancel' : 'Edit' }}
                  </v-btn>
                </div>
                <div v-if="editingVideoField === 'script'">
                  <QuillEditor v-model:content="videoInfo.script" :toolbar="editorToolbar" theme="snow" contentType="html"
                    style="min-height: 250px" />
                  <div class="mt-2">
                    <v-btn size="small" color="primary" @click="saveVideoField('script')">Save</v-btn>
                  </div>
                </div>
                <div v-else v-html="videoInfo.script || '<em>No script provided</em>'" class="rich-content" />
              </div>

              <v-select v-model="videoInfo.status" :items="videoStatusOptions" label="Video Status" variant="outlined"
                density="comfortable" @update:model-value="saveVideoField('status')" aria-label="Video Status" />

              <v-text-field v-model="videoInfo.publish_date" type="date" label="Publish Date" variant="outlined"
                density="comfortable" @blur="saveVideoField('publish_date')" aria-label="Publish Date" />

              <div v-if="videoInfo.youtube_video_id" class="my-4 video-embed">
                <iframe width="100%" height="315" :src="`https://www.youtube.com/embed/${videoInfo.youtube_video_id}`"
                  frameborder="0" allowfullscreen title="YouTube video player" />
              </div>

              <v-text-field v-model="videoInfo.youtube_video_id" label="YouTube Video ID" variant="outlined"
                density="comfortable" @blur="saveVideoField('youtube_video_id')" aria-label="YouTube Video ID" />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="4">
          <!-- Project Info Card -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-information</v-icon>
                <span class="text-h6 font-weight-bold">Project Information</span>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div class="info-list">
                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Project ID</div>
                  <div class="info-value font-weight-medium">#{{ project.project_id }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Components Used</div>
                  <div class="info-value font-weight-medium">
                    <v-icon size="18" class="mr-1" color="indigo">mdi-chip</v-icon>
                    {{ project.component_count || 0 }} items
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Total Cost</div>
                  <div class="info-value font-weight-bold text-h6" style="color: #2e7d32;">
                    {{ formatCurrency(project.total_cost || 0) }}
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Start Date</div>
                  <div v-if="editingField === 'start_date'">
                    <v-text-field v-model="editForm.start_date" type="date" density="comfortable" variant="outlined"
                      hide-details @blur="saveField('start_date')" aria-label="Edit Start Date" />
                  </div>
                  <div v-else class="info-value editable-date" @click="startEdit('start_date')" tabindex="0"
                    role="button" aria-label="Start date, click to edit">
                    <v-icon size="16" class="mr-1">mdi-calendar-start</v-icon>
                    {{ formatDateShort(project.start_date) }}
                    <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">End Date</div>
                  <div v-if="editingField === 'end_date'">
                    <v-text-field v-model="editForm.end_date" type="date" density="comfortable" variant="outlined"
                      hide-details @blur="saveField('end_date')" aria-label="Edit End Date" />
                  </div>
                  <div v-else class="info-value editable-date" @click="startEdit('end_date')" tabindex="0" role="button"
                    aria-label="End date, click to edit">
                    <v-icon size="16" class="mr-1">mdi-calendar-end</v-icon>
                    {{ formatDateShort(project.end_date) }}
                    <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Repository</div>
                  <div v-if="editingField === 'git_repository'">
                    <v-text-field v-model="editForm.git_repository" density="comfortable" variant="outlined"
                      hide-details placeholder="https://github.com/..." @blur="saveField('git_repository')"
                      @keyup.enter="saveField('git_repository')" aria-label="Edit Git Repository URL" />
                  </div>
                  <v-btn v-else-if="project.git_repository" variant="outlined" size="small" prepend-icon="mdi-git"
                    :href="project.git_repository" target="_blank" block aria-label="View Git Repository">
                    View Repository
                  </v-btn>
                  <v-btn v-else variant="outlined" size="small" prepend-icon="mdi-plus" block
                    @click="startEdit('git_repository')" aria-label="Add Git Repository">
                    Add Repository
                  </v-btn>
                </div>

                <div class="info-item">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Project Type</div>
                  <v-chip :color="project.is_yt_project ? 'red' : 'grey'" size="small" variant="outlined">
                    {{ project.is_yt_project ? 'YouTube Project' : 'Regular Project' }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- COMPONENTS SECTION WITH COMPACT HEADER -->
      <v-row class="mb-5">
        <v-col cols="12">
          <div class="components-header-section">
            <div class="d-flex align-center justify-space-between ga-3">
              <!-- Compact Stats Card -->
              <v-card class="component-header-card" elevation="0" rounded="lg">
                <v-card-text class="pa-3">
                  <div class="component-stats-grid">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <v-icon size="24" color="indigo">mdi-chip</v-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-label">Components</div>
                        <div class="stat-value">{{ componentsUsed.length }}</div>
                      </div>
                    </div>
                    <v-divider vertical class="mx-2" />
                    <div class="stat-item">
                      <div class="stat-icon">
                        <v-icon size="24" color="green">mdi-currency-inr</v-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-label">  </div>
                        <div class="stat-value">{{ formatCurrencyShort(project.total_cost || 0) }}</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <v-spacer />

              <!-- Add Button & Search -->
              <div class="d-flex align-center ga-2">
                <v-btn icon size="large" color="primary" variant="flat" class="add-component-btn"
                  @click="showAddDialog = true" aria-label="Add New Component" rounded="lg">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-text-field v-model="componentSearch" density="compact" variant="outlined" label="Search..."
                  prepend-inner-icon="mdi-magnify" single-line hide-details clearable style="width: 200px;"
                  aria-label="Search Components" />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- ADD COMPONENT DIALOG - COMPACT VERSION -->
      <v-dialog v-model="showAddDialog" max-width="520" class="add-component-dialog">
        <v-card elevation="2" rounded="xl" class="dialog-card">
          <!-- Dialog Header -->
          <v-toolbar color="primary" flat density="compact" class="dialog-header" rounded="t-xl">
            <v-icon size="24" class="mr-2">mdi-plus-circle</v-icon>
            <v-toolbar-title class="text-subtitle-1 font-weight-bold">
              Add Component
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon variant="text" size="x-small" @click="closeDialog" aria-label="Close Dialog">
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text class="pa-4">
            <v-form ref="addComponentForm" @submit.prevent="addComponentToProject">
              <!-- Component Selection -->
              <div class="mb-4">
                <label class="form-label">
                  Component
                  <span class="required">*</span>
                </label>
                <v-autocomplete v-model="newComponentId" :items="availableComponents" item-title="name" item-value="id"
                  placeholder="Select component..." variant="outlined" density="compact" prepend-inner-icon="mdi-chip"
                  clearable required persistent-placeholder aria-label="Select Component" no-data-text="No components"
                  :rules="[v => !!v || 'Required']" hide-details="auto">
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props" class="compact-list-item">
                      <template #prepend>
                        <v-avatar size="32" rounded="md" class="mr-2">
                          <v-img :src="item.raw.filename" :alt="item.raw.name" />
                        </v-avatar>
                      </template>
                      <div class="item-content">
                        <div class="item-name text-subtitle-2">{{ item.raw.name }}</div>
                        <div class="item-category text-caption">{{ item.raw.category_name }}</div>
                      </div>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </div>

              <!-- Quantity Input -->
              <div class="mb-4">
                <label class="form-label">
                  Quantity
                  <span class="required">*</span>
                </label>
                <v-text-field v-model.number="newComponentQuantity" placeholder="Qty" type="number" min="1"
                  variant="outlined" density="compact" prepend-inner-icon="mdi-counter" required
                  :rules="[v => v > 0 || 'Must be > 0']" hide-details="auto"
                  @keydown.enter.prevent="addComponentToProject" />
              </div>

              <!-- Component Preview - Compact -->
              <v-expand-transition>
                <div v-if="selectedComponent" class="preview-compact mb-4">
                  <v-card elevation="0" class="preview-card-compact">
                    <div class="preview-item">
                      <v-avatar size="48" rounded="md" class="mr-3">
                        <v-img :src="selectedComponent.filename" :alt="selectedComponent.name" />
                      </v-avatar>
                      <div class="preview-text">
                        <div class="preview-name text-body-2 font-weight-bold">
                          {{ selectedComponent.name }}
                        </div>
                        <div class="preview-meta text-caption">
                          {{ selectedComponent.category_name }}
                          <span v-if="selectedComponent.box_label" class="ml-1">
                            • {{ selectedComponent.box_label }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-expand-transition>

              <!-- Added Items - Compact List -->
              <v-expand-transition>
                <div v-if="addedItems.length > 0" class="added-items-compact mb-4">
                  <div class="items-badge">
                    <v-icon size="16" class="mr-1">mdi-check-circle</v-icon>
                    {{ addedItems.length }} item{{ addedItems.length !== 1 ? 's' : '' }}
                  </div>
                  <v-list density="compact" class="compact-items-list">
                    <v-list-item v-for="(item, index) in addedItems" :key="index" class="added-item-compact">
                      <v-avatar size="28" rounded="sm" class="mr-2">
                        <v-img :src="item.component.filename" :alt="item.component.name" />
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="text-caption font-weight-600">{{ item.component.name }}</div>
                        <div class="text-xs">Qty: {{ item.quantity }}</div>
                      </div>
                      <v-btn icon variant="text" size="x-small" color="error" @click="removeAddedItem(index)"
                        aria-label="Remove">
                        <v-icon size="16">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </div>
              </v-expand-transition>

              <!-- Dialog Actions - Compact -->
              <div class="dialog-actions-compact">
                <v-btn variant="tonal" @click="closeDialog" block size="small" class="mb-2">
                  Cancel
                </v-btn>

                <v-btn color="primary" @click="addComponentToProject" :loading="addingComponent" block size="small"
                  prepend-icon="mdi-plus" class="mb-2">
                  Add to Queue
                </v-btn>

                <v-btn v-if="addedItems.length > 0" color="success" @click="submitAllComponents"
                  :loading="submittingAll" block size="small" prepend-icon="mdi-check-all" variant="flat">
                  Save ({{ addedItems.length }})
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- COMPONENTS DATA TABLE SECTION -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="0" class="content-card">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2" color="indigo">mdi-list-box</v-icon>
                <span class="text-h6 font-weight-bold">Components Used</span>
              </div>
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-0">
              <v-data-table :headers="componentHeaders" :items="componentsUsed" :search="componentSearch"
                :items-per-page="10" :items-per-page-options="[5, 10, 25, 50]" class="components-data-table" hover>
                <!-- Image Column -->
                <template #item.filename="{ item }">
                  <v-avatar size="56" rounded="lg" class="my-2">
                    <v-img :src="item.filename" :alt="item.name" cover>
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-icon size="32" color="grey-lighten-2">mdi-image-outline</v-icon>
                        </div>
                      </template>
                    </v-img>
                  </v-avatar>
                </template>

                <!-- Component Name Column -->
                <template #item.name="{ item }">
                  <div class="component-name-cell">
                    <span class="component-name-text font-weight-semibold">{{ item.name }}</span>
                  </div>
                </template>

                <!-- Category & Box Column -->
                <template #item.category="{ item }">
                  <div class="category-cell">
                    <v-chip size="small" color="blue-grey" variant="tonal" class="mb-1">
                      {{ item.category_name }}
                    </v-chip>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                      {{ item.box_label || 'No box' }}
                    </div>
                  </div>
                </template>

                <!-- Description Column -->
                <template #item.description="{ item }">
                  <v-tooltip location="bottom" max-width="400">
                    <template #activator="{ props }">
                      <div v-bind="props" class="description-cell text-body-2">
                        {{ item.description || 'No description' }}
                      </div>
                    </template>
                    <span>{{ item.description || 'No description available' }}</span>
                  </v-tooltip>
                </template>

                <!-- Quantity Column -->
                <template #item.quantity_used="{ item }">
                  <v-chip color="indigo" variant="flat" size="small" class="font-weight-bold">
                    {{ item.quantity_used }}
                  </v-chip>
                </template>

                <!-- Actions Column -->
                <template #item.actions="{ item }">
                  <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="removeComponent(item.id)"
                    aria-label="Remove Component" />
                </template>

                <!-- No data state -->
                <template #no-data>
                  <div class="text-center py-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
                    <div class="text-h6 text-medium-emphasis mt-4">No components added yet</div>
                    <p class="text-body-2 text-medium-emphasis">
                      Click the <v-icon size="20" inline class="mx-1">mdi-plus</v-icon> button above to add components
                    </p>
                  </div>
                </template>

                <!-- No results state -->
                <template #no-results>
                  <div class="text-center py-6">
                    <v-icon size="48" color="orange">mdi-magnify-remove-outline</v-icon>
                    <div class="text-subtitle-1 text-medium-emphasis mt-2">No matching components found</div>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Delete Confirm Dialog -->
    <DeleteConfirmDialog v-model="showDeleteDialog" :item-name="project?.project_name" @confirm="handleDeleteConfirm" />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccess" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showError" color="error" :timeout="5000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// Router and Store
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

// Project Data
const project = ref(null)
const videoInfo = ref({})
const loading = ref(true)
const error = ref(null)
const saving = ref(false)

// Editing State
const editingField = ref(null)
const editingVideoField = ref(null)
const editForm = ref({})
const originalValues = ref({})

// UI State
const showDeleteDialog = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')
const showAddDialog = ref(false)

// Components State
const componentsUsed = ref([])
const availableComponents = ref([])
const componentSearch = ref('')
const newComponentId = ref(null)
const newComponentQuantity = ref(1)
const addingComponent = ref(false)
const submittingAll = ref(false)
const addedItems = ref([])
const addComponentForm = ref(null)

// Constants
const statusOptions = ['Planning', 'In Progress', 'Testing', 'Completed', 'On Hold', 'Cancelled']

const videoStatusOptions = ['Draft', 'In Review', 'Published', 'Archived']

const editorToolbar = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image', 'video'],
  ['clean']
]

const componentHeaders = [
  { title: 'Image', key: 'filename', sortable: false, width: '90px', align: 'center' },
  { title: 'Component Name', key: 'name', sortable: true, width: '220px' },
  { title: 'Category / Box', key: 'category', sortable: true, width: '200px' },
  { title: 'Description', key: 'description', sortable: false, width: '300px' },
  { title: 'Quantity', key: 'quantity_used', sortable: true, align: 'center', width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '100px' }
]

// Computed Properties
const selectedComponent = computed(() => {
  if (!newComponentId.value) return null
  return availableComponents.value.find(c => c.id === newComponentId.value)
})

// Utility Functions
const getStatusColor = (status) => {
  const colors = {
    Planning: 'blue',
    'In Progress': 'orange',
    Testing: 'purple',
    Completed: 'green',
    'On Hold': 'grey',
    Cancelled: 'red',
    Created: 'blue-grey'
  }
  return colors[status] || 'grey'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateShort = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatCurrencyShort = (amount) => {
  if (!amount || amount === 0) return '₹0'

  if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(1) + 'L'
  } else if (amount >= 1000) {
    return '₹' + (amount / 1000).toFixed(1) + 'K'
  }

  return '₹' + amount
}

const toDateInputFormat = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Dialog Functions
const closeDialog = () => {
  showAddDialog.value = false
  resetDialogForm()
}

const resetDialogForm = () => {
  newComponentId.value = null
  newComponentQuantity.value = 1
  if (addComponentForm.value) {
    addComponentForm.value.reset()
  }
}

// Component Management Functions
const addComponentToProject = async () => {
  if (!newComponentId.value || newComponentQuantity.value < 1) {
    errorMessage.value = 'Please select a component and enter quantity'
    showError.value = true
    return
  }

  try {
    addingComponent.value = true

    const component = availableComponents.value.find(c => c.id === newComponentId.value)
    addedItems.value.push({
      component,
      quantity: newComponentQuantity.value
    })

    successMessage.value = `${component.name} added to queue`
    showSuccess.value = true

    resetDialogForm()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to add component'
    showError.value = true
  } finally {
    addingComponent.value = false
  }
}

const removeAddedItem = (index) => {
  addedItems.value.splice(index, 1)
  if (addedItems.value.length === 0) {
    resetDialogForm()
  }
}

const submitAllComponents = async () => {
  try {
    submittingAll.value = true

    for (const item of addedItems.value) {
      await projectStore.addComponentToProject(
        project.value.project_id,
        item.component.id,
        item.quantity
      )
    }

    await loadComponentsUsed()
    await loadProject()

    successMessage.value = `${addedItems.value.length} components added successfully`
    showSuccess.value = true

    addedItems.value = []
    closeDialog()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to add components'
    showError.value = true
  } finally {
    submittingAll.value = false
  }
}

const removeComponent = async (componentId) => {
  try {
    await projectStore.removeComponentFromProject(
      project.value.project_id,
      componentId
    )
    await loadComponentsUsed()
    await loadProject()

    successMessage.value = 'Component removed successfully'
    showSuccess.value = true
  } catch (err) {
    errorMessage.value = err.message || 'Failed to remove component'
    showError.value = true
  }
}

// Editing Handlers
const startEdit = (field) => {
  editingField.value = field
  editForm.value = {
    ...project.value,
    start_date: toDateInputFormat(project.value.start_date),
    end_date: toDateInputFormat(project.value.end_date)
  }
  originalValues.value[field] = project.value[field]
}

const cancelEdit = () => {
  editingField.value = null
  editingVideoField.value = null
  editForm.value = {}
}

const saveField = async (field) => {
  if (editForm.value[field] === originalValues.value[field]) {
    cancelEdit()
    return
  }

  try {
    saving.value = true
    const updateData = { [field]: editForm.value[field] }

    if (field === 'start_date' || field === 'end_date') {
      updateData[field] = editForm.value[field] ? new Date(editForm.value[field]).toISOString() : null
    }

    await projectStore.updateProject(project.value.project_id, updateData)
    await loadProject()

    successMessage.value = 'Updated successfully'
    showSuccess.value = true
    cancelEdit()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to update'
    showError.value = true
  } finally {
    saving.value = false
  }
}

const toggleEditing = (field) => {
  editingVideoField.value = editingVideoField.value === field ? null : field
}

const saveVideoField = async (field) => {
  try {
    await projectStore.updateVideo(project.value.project_id, { [field]: videoInfo.value[field] })
    successMessage.value = 'Video info updated successfully'
    showSuccess.value = true
    editingVideoField.value = null
  } catch (err) {
    errorMessage.value = err.message || 'Failed to update video info'
    showError.value = true
  }
}

// Data Loading Functions
const loadProject = async () => {
  loading.value = true
  error.value = null

  try {
    const projectId = parseInt(route.params.id)
    const fetchedProject = await projectStore.fetchProjectById(projectId)
    project.value = fetchedProject

    if (project.value?.is_yt_project) {
      await loadVideoInfo(projectId)
    }

    if (project.value?.project_id) {
      await loadComponentsUsed()
    }
  } catch (err) {
    error.value = err.message || 'Project not found'
  } finally {
    loading.value = false
  }
}

const loadVideoInfo = async (projectId) => {
  try {
    const video = await projectStore.fetchVideoByProjectId(projectId)
    videoInfo.value = video || {}
  } catch {
    videoInfo.value = {}
  }
}

const loadComponentsUsed = async () => {
  try {
    componentsUsed.value = await projectStore.fetchComponentsUsed(project.value.project_id)
  } catch (err) {
    componentsUsed.value = []
    console.error('Failed to load components used:', err)
  }
}

const loadAvailableComponents = async () => {
  try {
    availableComponents.value = await projectStore.fetchAvailableComponents()
  } catch (err) {
    availableComponents.value = []
    console.error('Failed to load available components:', err)
  }
}

// Navigation and Deletion
const goBack = () => {
  router.push({ name: 'Projects' })
}

const deleteProject = () => {
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await projectStore.deleteProject(project.value.project_id)
    successMessage.value = 'Project deleted successfully'
    showSuccess.value = true

    setTimeout(() => {
      router.push({ name: 'Projects' })
    }, 1000)
  } catch (err) {
    errorMessage.value = err.message || 'Failed to delete project'
    showError.value = true
  }
}

// Lifecycle
onMounted(() => {
  loadProject()
  loadAvailableComponents()
})
</script>

<style scoped>
.project-detail-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-card,
.content-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  animation: fadeIn 0.5s ease-out;
}

.editable-field,
.editable-date,
.editable-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.editable-field:hover,
.editable-date:hover,
.editable-chip:hover {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 2px 4px;
}

.edit-icon {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editable-field:hover .edit-icon,
.editable-date:hover .edit-icon,
.editable-chip:hover .edit-icon {
  opacity: 0.6;
}

.description-content {
  line-height: 1.8;
  white-space: pre-wrap;
}

.rich-content {
  line-height: 1.6;
  color: #333;
}

.rich-content p {
  margin-bottom: 1em;
}

.rich-content ul,
.rich-content ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.rich-content a {
  color: #1e88e5;
  text-decoration: underline;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-label {
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.video-embed {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ============= COMPACT COMPONENTS SECTION ============= */

.components-header-section {
  padding: 0;
}

.component-header-card {
  border: 1px solid #e0e7f1;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f8fc 100%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.component-stats-grid {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 12px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 90px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(25, 118, 210, 0.08);
  border-radius: 10px;
}

.stat-item:nth-child(3) .stat-icon {
  background: rgba(76, 175, 80, 0.08);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #90a4ae;
  letter-spacing: 0.4px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a237e;
  line-height: 1;
}

.add-component-btn {
  border-radius: 12px !important;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.15) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.add-component-btn:hover {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.25) !important;
  transform: translateY(-1px);
}

/* ============= DIALOG STYLES ============= */

.dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
  color: white;
  padding: 12px 16px !important;
  border-radius: 16px 16px 0 0;
}

.dialog-header :deep(.v-toolbar__title) {
  color: white !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
}

.dialog-header :deep(.v-btn) {
  color: white !important;
}

/* ============= FORM STYLES ============= */

.form-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #263238;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
}

.required {
  color: #e53935;
  font-weight: 900;
}

.compact-list-item {
  padding: 8px 12px !important;
  min-height: 48px !important;
}

.item-content {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #1a237e;
  line-height: 1.2;
}

.item-category {
  color: #90a4ae;
}

/* ============= PREVIEW COMPACT ============= */

.preview-compact {
  animation: slideDown 0.2s ease;
}

.preview-card-compact {
  background: linear-gradient(135deg, #f5f8fc 0%, #f0f4f8 100%) !important;
  border: 1px solid #e0e7f1 !important;
  border-radius: 10px !important;
  padding: 10px;
}

.preview-item {
  display: flex;
  align-items: center;
}

.preview-text {
  flex: 1;
  min-width: 0;
}

.preview-name {
  color: #1a237e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-meta {
  color: #90a4ae;
  margin-top: 2px;
}

/* ============= ADDED ITEMS COMPACT ============= */

.added-items-compact {
  animation: slideDown 0.2s ease;
}

.items-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #2e7d32;
  background: #f1f8e9;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.compact-items-list {
  background: #f5f5f5 !important;
  border-radius: 8px !important;
  padding: 6px !important;
}

.added-item-compact {
  background: white !important;
  margin-bottom: 4px !important;
  border-radius: 6px !important;
  padding: 6px 8px !important;
  min-height: 42px !important;
}

.added-item-compact:last-child {
  margin-bottom: 0 !important;
}

/* ============= DIALOG ACTIONS ============= */

.dialog-actions-compact {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e8edf2;
}

/* ============= TABLE SECTION ============= */

.components-data-table {
  background: transparent;
}

.components-data-table :deep(thead) {
  background: #f8f9fa;
}

.components-data-table :deep(thead th) {
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #455a64 !important;
  border-bottom: 2px solid #e0e0e0 !important;
  padding: 14px 10px !important;
}

.components-data-table :deep(tbody tr:hover) {
  background-color: #f5f7fa !important;
  transition: background-color 0.15s ease;
}

.components-data-table :deep(tbody td) {
  padding: 10px !important;
  border-bottom: 1px solid #f0f0f0 !important;
  font-size: 0.9rem;
}

.component-name-cell {
  display: flex;
  align-items: center;
  min-height: 60px;
}

.component-name-text {
  font-size: 0.9rem;
  color: #1a237e;
  line-height: 1.3;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.description-cell {
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  color: #616161;
  font-size: 0.85rem;
}

.components-data-table :deep(.v-data-table-footer) {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background: #fafbfc;
  font-size: 0.85rem;
}

/* ============= RESPONSIVE ============= */

@media (max-width: 960px) {
  .component-stats-grid {
    gap: 8px;
  }

  .stat-value {
    font-size: 1rem;
  }

  .components-data-table :deep(tbody td) {
    padding: 8px !important;
  }

  .description-cell {
    max-width: 180px;
  }
}

@media (max-width: 600px) {
  .components-header-section {
    flex-direction: column;
    gap: 12px;
  }

  .component-header-card {
    min-width: 100%;
  }
}

/* ============= ANIMATIONS ============= */

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-compact,
.added-items-compact {
  animation: slideDown 0.2s ease;
}

/* ============= UTILITIES ============= */

.text-xs {
  font-size: 0.7rem;
  color: #78909c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
