<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="600px"
    persistent
    scrollable
  >
    <v-card class="vendor-dialog">
      <v-card-title class="dialog-header pa-6">
        <div class="d-flex align-center">
          <v-avatar 
            :color="isEditMode ? 'primary' : 'success'" 
            size="40" 
            class="mr-3"
          >
            <v-icon color="white" size="24">
              {{ isEditMode ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-0">
              {{ isEditMode ? 'Edit Vendor' : 'Add New Vendor' }}
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ isEditMode ? 'Update vendor information' : 'Create a new vendor entry' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid">
          <!-- Vendor Icon Upload -->
          <div class="text-center mb-6">
            <div class="icon-upload-wrapper mx-auto" @click="openFilePicker">
              <v-avatar size="120" class="upload-avatar">
                <img 
                  v-if="displayedIcon !== '/default-vendor.png'" 
                  :src="displayedIcon" 
                  alt="Vendor Icon"
                  class="vendor-icon-preview"
                />
                <div v-else class="upload-placeholder">
                  <v-icon size="48" color="grey-lighten-1">mdi-image-plus</v-icon>
                </div>
              </v-avatar>
              <div class="upload-overlay">
                <v-icon color="white" size="32">mdi-camera</v-icon>
              </div>
            </div>
            <p class="text-caption text-medium-emphasis mt-3 mb-0">
              Click to upload vendor logo
            </p>
            <p class="text-caption text-medium-emphasis">
              PNG, JPG, WEBP (max 5MB)
            </p>
          </div>

          <!-- Hidden file input -->
          <input 
            type="file" 
            accept="image/*" 
            ref="fileInput" 
            @change="onFileChange" 
            style="display: none" 
          />

          <!-- Form Fields -->
          <v-row dense>
            <v-col cols="12">
              <v-text-field 
                v-model="form.vendorname" 
                :rules="[rules.required]" 
                label="Vendor Name *" 
                prepend-inner-icon="mdi-store"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-4"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field 
                v-model="form.website" 
                label="Website" 
                prepend-inner-icon="mdi-web"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-4"
                placeholder="https://example.com"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field 
                v-model="form.contactemail" 
                label="Contact Email" 
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-4"
                type="email"
                placeholder="contact@example.com"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field 
                v-model="form.phonenumber" 
                label="Phone Number" 
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                placeholder="+91 XXXXX XXXXX"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn 
          variant="text" 
          @click="closeDialog"
          size="large"
          :disabled="isSubmitting"
        >
          Cancel
        </v-btn>
        <v-btn 
          :disabled="!valid" 
          color="primary" 
          @click="submitForm" 
          :loading="isSubmitting"
          size="large"
          variant="flat"
          class="px-6"
        >
          {{ isEditMode ? 'Update Vendor' : 'Create Vendor' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useVendorStore } from '@/stores/vendorStore';

const props = defineProps({
  modelValue: Boolean,
  vendorItem: Object
});

const emit = defineEmits(['update:modelValue', 'success', 'error']);

const vendorStore = useVendorStore();
const fileInput = ref(null);
const isSubmitting = ref(false);

const form = ref({
  vendorname: '',
  website: '',
  contactemail: '',
  phonenumber: '',
  vendor_icon_name: '',
  vendor_icon_type: '',
  vendor_icon_content: '',
  filename: ''
});

const originalImage = ref({
  vendor_icon_name: '',
  vendor_icon_type: '',
  vendor_icon_content: ''
});

const valid = ref(false);
const formRef = ref(null);

const rules = {
  required: value => !!value || 'This field is required'
};

const isEditMode = computed(() => !!props.vendorItem);

function extractFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('filename') || url.split('/').pop();
  } catch {
    return url.split('/').pop();
  }
}

watch(() => props.vendorItem, async (val) => {
  if (val) {
    form.value = {
      vendorname: val.vendor_name || '',
      website: val.website || '',
      contactemail: val.contact_email || '',
      phonenumber: val.phone_number || '',
      vendor_icon_name: val.vendor_icon_name || '',
      vendor_icon_type: val.vendor_icon_type || '',
      vendor_icon_content: val.vendor_icon_content || '',
      filename: val.filename || ''
    };

    if (val.filename && !val.vendor_icon_content) {
      try {
        const response = await fetch(val.filename);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          const filename = extractFilenameFromUrl(val.filename);
          form.value.vendor_icon_content = e.target.result.split(',')[1];
          form.value.vendor_icon_type = blob.type.split('/')[1] || blob.type;
          form.value.vendor_icon_name = filename;
          
          originalImage.value = {
            vendor_icon_name: filename,
            vendor_icon_type: blob.type.split('/')[1] || blob.type,
            vendor_icon_content: form.value.vendor_icon_content
          };
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to fetch vendor image:', error);
      }
    } else {
      originalImage.value = {
        vendor_icon_name: val.vendor_icon_name || '',
        vendor_icon_type: val.vendor_icon_type || '',
        vendor_icon_content: val.vendor_icon_content || ''
      };
    }
  } else {
    resetForm();
  }
});

const displayedIcon = computed(() => {
  if (form.value.vendor_icon_content && form.value.vendor_icon_type) {
    return `data:image/${form.value.vendor_icon_type};base64,${form.value.vendor_icon_content}`;
  }
  if (props.vendorItem && props.vendorItem.filename) {
    return props.vendorItem.filename;
  }
  return '/default-vendor.png';
});

function openFilePicker() {
  if (fileInput.value) fileInput.value.click();
}

function onFileChange(event) {
  const files = event.target.files;
  if (!files || !files.length) {
    if (isEditMode.value) {
      form.value.vendor_icon_name = originalImage.value.vendor_icon_name;
      form.value.vendor_icon_type = originalImage.value.vendor_icon_type;
      form.value.vendor_icon_content = originalImage.value.vendor_icon_content;
    } else {
      form.value.vendor_icon_name = '';
      form.value.vendor_icon_type = '';
      form.value.vendor_icon_content = '';
    }
    return;
  }
  const file = files[0];
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    emit('error', { message: 'File size must be less than 5MB' });
    return;
  }
  
  form.value.vendor_icon_name = file.name;
  form.value.vendor_icon_type = file.type.split('/')[1] || file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.vendor_icon_content = e.target.result.split(',')[1];
  };
  reader.readAsDataURL(file);
}

function resetForm() {
  form.value = {
    vendorname: '',
    website: '',
    contactemail: '',
    phonenumber: '',
    vendor_icon_name: '',
    vendor_icon_type: '',
    vendor_icon_content: '',
    filename: ''
  };
  originalImage.value = {
    vendor_icon_name: '',
    vendor_icon_type: '',
    vendor_icon_content: ''
  };
  if (formRef.value) formRef.value.resetValidation();
}

function closeDialog() {
  emit('update:modelValue', false);
  resetForm();
}

async function submitForm() {
  if (!formRef.value.validate()) return;
  isSubmitting.value = true;
  try {
    const payload = {
      vendor_name: form.value.vendorname,
      website: form.value.website,
      contact_email: form.value.contactemail,
      phone_number: form.value.phonenumber,
      vendor_icon_name: form.value.vendor_icon_name,
      vendor_icon_type: form.value.vendor_icon_type,
      vendor_icon_content: form.value.vendor_icon_content
    };

    let response;
    if (isEditMode.value) {
      response = await vendorStore.updateVendor(props.vendorItem.vendor_id, payload);
    } else {
      response = await vendorStore.createVendor(payload);
    }

    closeDialog();
    emit('success', { 
      message: isEditMode.value ? 'Vendor updated successfully' : 'Vendor created successfully', 
      data: response 
    });
  } catch (error) {
    emit('error', { message: error.message || 'Failed to save vendor' });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.vendor-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dialog-header .text-medium-emphasis {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Icon Upload */
.icon-upload-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-upload-wrapper:hover {
  transform: scale(1.05);
}

.icon-upload-wrapper:hover .upload-overlay {
  opacity: 1;
}

.upload-avatar {
  border: 3px dashed #e0e0e0;
  background: #fafafa;
  transition: all 0.3s ease;
}

.icon-upload-wrapper:hover .upload-avatar {
  border-color: #667eea;
  background: #f5f7ff;
}

.vendor-icon-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.upload-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
