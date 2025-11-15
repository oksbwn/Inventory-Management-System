import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseFormField from '@/components/base/BaseFormField.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSnackbar from '@/components/base/BaseSnackbar.vue'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import BaseLoading from '@/components/base/BaseLoading.vue'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
const pinia = createPinia()

app.component('BaseButton', BaseButton)
app.component('BaseCard', BaseCard)
app.component('BaseDialog', BaseDialog)
app.component('BaseTable', BaseTable)
app.component('BaseFormField', BaseFormField)
app.component('BaseSelect', BaseSelect)
app.component('BaseSnackbar', BaseSnackbar)
app.component('BaseEmpty', BaseEmpty)
app.component('BaseLoading', BaseLoading)


app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')
