<script setup>
import { ref, computed, watch } from 'vue'
import { useStockStore } from '@/stores/stockStore'

const props = defineProps({
  modelValue: Boolean,
  stockItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const stockStore = useStockStore()
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

// Dialog state
const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditMode = computed(() => !!props.stockItem?.id)

// Form data
const formData = ref({
  name: '',
  sku: '',
  category: '',
  status: 'In Stock',
  quantity: 0,
  price: 0,
  minStockLevel: 10,
  location: '',
  supplier: '',
  description: ''
})

// Dropdown options
const categories = ref([
  'Electronics',
  'Hardware',
  'Tools',
  'Materials',
  'Components',
  'Consumables'
])

const statusOptions = ref([
  'In Stock',
  'Out of Stock',
  'On Order',
  'Discontinued'
])

// Validation rules
const nameRules = [
  v => !!v || 'Product name is required',
  v => (v && v.length >= 3) || 'Name must be at least 3 characters',
  v => (v && v.length <= 100) || 'Name must be less than 100 characters'
]

const skuRules = [
  v => !v || v.length <= 50 || 'SKU must be less than 50 characters'
]

const categoryRules = [
  v => !!v || 'Category is required'
]

const statusRules = [
  v => !!v || 'Status is required'
]

const quantityRules = [
  v => v !== null && v !== '' || 'Quantity is required',
  v => v >= 0 || 'Quantity must be 0 or greater'
]

const priceRules = [
  v => v !== null && v !== '' || 'Price is required',
  v => v >= 0 || 'Price must be 0 or greater'
]

const locationRules = [
  v => !v || v.length <= 100 || 'Location must be less than 100 characters'
]

// Define resetForm BEFORE watch
const resetForm = () => {
  formData.value = {
    name: '',
    sku: '',
    category: '',
    status: 'In Stock',
    quantity: 0,
    price: 0,
    minStockLevel: 10,
    location: '',
    supplier: '',
    description: ''
  }
  if (formRef.value) {
    formRef.value.reset()
  }
}

// Methods
const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid: isValid } = await formRef.value.validate()
  
  if (!isValid) return

  loading.value = true

  try {
    if (isEditMode.value) {
      await stockStore.updateStock(props.stockItem.id, formData.value)
    } else {
      await stockStore.createStock(formData.value)
    }

    emit('success', {
      type: isEditMode.value ? 'update' : 'create',
      message: `Stock ${isEditMode.value ? 'updated' : 'created'} successfully!`
    })
    
    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save stock:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
  resetForm()
}

// Watch for stockItem changes (when editing) - NOW resetForm is defined
watch(() => props.stockItem, (newItem) => {
  if (newItem) {
    formData.value = { ...newItem }
  } else {
    resetForm()
  }
}, { immediate: true })
</script>
