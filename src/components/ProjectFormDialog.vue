<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">
          {{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}
        </v-icon>
        {{ isEdit ? 'Edit Project' : 'Add New Project' }}
      </v-card-title>
      <v-divider/>

      <!-- Form -->
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-card-text class="pa-6" style="overflow: visible; max-height: none;">
          <v-row>

            <!-- Project Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.project_name"
                label="Project Name"
                prepend-icon="mdi-briefcase"
                variant="outlined"
                :rules="nameRules"
                required
                counter="255"
                placeholder="Enter project name..."
              />
            </v-col>

            <!-- Status -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                prepend-icon="mdi-format-list-bulleted"
                variant="outlined"
                clearable
              />
            </v-col>

            <!-- YouTube Toggle -->
            <v-col cols="12" md="6">
              <v-switch
                v-model="formData.is_yt_project"
                label="YouTube Project"
                color="red"
                prepend-icon="mdi-youtube"
                inset
              />
            </v-col>

            <!-- Start Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.start_date"
                label="Start Date"
                type="date"
                prepend-icon="mdi-calendar-start"
                variant="outlined"
                :rules="startDateRules"
              />
            </v-col>

            <!-- End Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.end_date"
                label="End Date"
                type="date"
                prepend-icon="mdi-calendar-end"
                variant="outlined"
                :rules="endDateRules"
              />
            </v-col>

            <!-- Git Repository URL -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.git_repository"
                label="Git Repository URL"
                prepend-icon="mdi-git"
                variant="outlined"
                :rules="gitRepoRules"
                placeholder="https://github.com/username/repository"
              >
                <template #append-inner>
                  <v-btn
                    v-if="formData.git_repository"
                    icon
                    size="small"
                    :href="formData.git_repository"
                    target="_blank"
                  >
                    <v-icon size="16">mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <!-- HTML Description Editor -->
            <v-col cols="12">
              <label class="form-label font-weight-medium mb-2">
                Description (HTML)
              </label>
              <!-- Toolbar -->
              <div class="editor-toolbar mb-2">
                <v-btn icon @click="editor.chain().focus().toggleBold().run()">
                  <v-icon>mdi-format-bold</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().toggleItalic().run()">
                  <v-icon>mdi-format-italic</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().toggleUnderline().run()">
                  <v-icon>mdi-format-underline</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().toggleBulletList().run()">
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().toggleOrderedList().run()">
                  <v-icon>mdi-format-list-numbered</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().setHeading({ level: 2 }).run()">
                  <v-icon>mdi-format-header-2</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().undo().run()">
                  <v-icon>mdi-undo</v-icon>
                </v-btn>
                <v-btn icon @click="editor.chain().focus().redo().run()">
                  <v-icon>mdi-redo</v-icon>
                </v-btn>
              </div>
              <div class="editor-wrapper">
                <EditorContent :editor="editor"/>
              </div>
            </v-col>

          </v-row>
        </v-card-text>

        <v-divider/>

        <v-card-actions class="pa-4">
          <v-spacer/>
          <v-btn variant="outlined" @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!valid"
          >
            {{ isEdit ? 'Update Project' : 'Create Project' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useProjectStore } from '@/stores/projectStore'

// Props & Emits
const props = defineProps({
  modelValue: Boolean,
  projectItem: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue','success','error'])

// Pinia Store
const projectStore = useProjectStore()

// Refs & State
const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => props.projectItem?.project_id)

// Form Data
const formData = ref({
  project_name:'',
  description:'',
  status:null,
  start_date:'',
  end_date:'',
  is_yt_project:false,
  git_repository:''
})

// Validation & Options
const statusOptions = ['Planning','In Progress','Testing','Completed','On Hold','Cancelled']
const nameRules = [
  v=>!!v||'Required',v=>v?.length<=255||'Max 255 chars',v=>v?.length>=2||'Min 2 chars'
]
const startDateRules = [
  v=>!v||!formData.value.end_date||toDate(v)<=toDate(formData.value.end_date)||'Start≤End'
]
const endDateRules = [
  v=>!v||!formData.value.start_date||toDate(v)>=toDate(formData.value.start_date)||'End≥Start'
]
const gitRepoRules = [
  v=>!v||isValidUrl(v)||'Invalid URL',
  v=>!v||isGitUrl(v)||'Invalid Git URL'
]

// TipTap Editor
const editor = useEditor({
  extensions:[StarterKit],
  content:'',
  onUpdate({editor}){ formData.value.description=editor.getHTML() }
})

// Helpers
function isValidUrl(s){try{new URL(s);return true}catch{return false}}
function isGitUrl(u){if(!u)return true;return[/^https:\/\/github\.com\//,/^git@/,/\.git$/].some(r=>r.test(u))}
function toDateString(v){if(!v)return'';if(/^\d{4}-\d{2}-\d{2}$/.test(v))return v;
  const d=new Date(v);const mm=String(d.getMonth()+1).padStart(2,'0');
  const dd=String(d.getDate()).padStart(2,'0');return`${d.getFullYear()}-${mm}-${dd}`}
function toDate(v){return new Date(v).getTime()}

// Dialog Control
function closeDialog(){resetForm();dialog.value=false}
function resetForm(){
  formData.value={project_name:'',description:'',status:null,
    start_date:'',end_date:'',is_yt_project:false,git_repository:''}
  form.value?.resetValidation()
  editor.value?.commands.setContent('')
}

// Initialize form on open
function populateForm(){
  if(props.projectItem){
    const p=props.projectItem
    formData.value.project_name=p.project_name||''
    formData.value.status=p.status||null
    formData.value.start_date=toDateString(p.start_date)
    formData.value.end_date=toDateString(p.end_date)
    formData.value.is_yt_project=p.is_yt_project||false
    formData.value.git_repository=p.git_repository||''
    editor.value?.commands.setContent(p.description||'')
  } else resetForm()
}

// Submit
async function handleSubmit(){
  if(!valid.value) return
  loading.value=true
  try{
    const data={...formData.value,
      // convert back to full ISO if needed:
      start_date:formData.value.start_date?new Date(formData.value.start_date).toISOString():null,
      end_date:formData.value.end_date?new Date(formData.value.end_date).toISOString():null
    }
    let res = isEdit.value
      ? await projectStore.updateProject(props.projectItem.project_id,data)
      : await projectStore.createProject(data)
    emit('success',{message:isEdit.value?'Updated':'Created',project:res})
  }catch(e){emit('error',{message:e.message||'Error'})}
  finally{loading.value=false}
}

watch(()=>props.modelValue,n=>{ if(n) nextTick(populateForm) })
watch(()=>props.projectItem,()=>{ if(props.modelValue) populateForm() })
</script>

<style scoped>
.form-label{font-size:.95rem;font-weight:600;}
.editor-toolbar{display:flex;gap:8px;margin-bottom:4px;}
.editor-wrapper{border:1px solid #ccc;border-radius:5px;max-height:300px;overflow-y:auto;padding:8px;}
.editor-wrapper .ProseMirror{min-height:180px;}
</style>
