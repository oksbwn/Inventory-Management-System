import { defineStore } from 'pinia';
import { ref } from 'vue';
import projectService from '@/api/services/projectService';

export const useProjectStore = defineStore('project', () => {
  const projects = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // Metadata
  const totalProjects = ref(0);
  const activeProjects = ref(0);
  const completedProjects = ref(0);

  // Fetch project list with pagination and search params
  const fetchProjects = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjects(params);
      projects.value = response || [];
      totalItems.value = response[0].total || 0;
      await fetchProjectsMeta();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch projects metadata summary
  const fetchProjectsMeta = async () => {
    try {
      const response = await projectService.getProjectsMeta();
      const meta = response[0] || {};
      totalProjects.value = meta.totalProjects || 0;
      activeProjects.value = meta.activeProjects || 0;
      completedProjects.value = meta.completedProjects || 0;
    } catch {
      totalProjects.value = 0;
      activeProjects.value = 0;
      completedProjects.value = 0;
    }
  };

  return {
    projects,
    totalItems,
    loading,
    error,
    totalProjects,
    activeProjects,
    completedProjects,
    fetchProjects,
    fetchProjectsMeta,
  };
});
