import { ref } from 'vue'

export const snackbarMessage = ref('')
export const snackbarVisible = ref(false)
export const snackbarType = ref<'success' | 'error'>('error')

export function showSnackbar(message: string, type: 'success' | 'error' = 'error', duration = 3000) {
  snackbarMessage.value = message
  snackbarType.value = type
  snackbarVisible.value = true

  setTimeout(() => {
    snackbarVisible.value = false
    snackbarMessage.value = ''
  }, duration)
}
