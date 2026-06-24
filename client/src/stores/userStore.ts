import apiClient from '@/api/api'
import { defineStore } from 'pinia'
import { showSnackbar } from './snackbar'
import type { User } from '@/types/User'
import router from '@/router'
import type { Balance } from '@/types/Balance'

type UserState = {
  profile: User | null
  isLoading: boolean
  balance: Balance
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    isLoading: false,
    balance: {
      amount: 0,
    },
  }),
  getters: {
    isAdmin: (state) => state.profile?.role === 'admin',
    isExist: (state) => !!state.profile?.email,
  },
  actions: {
    async loadCurrentUser() {
      this.isLoading = true
      try {
        const response = await apiClient.get('/users/current')
        this.profile = response.data
      } catch (err) {
        showSnackbar('Failed to load user')
        console.error(err)
        this.profile = null
        router.push('/login')
      } finally {
        this.isLoading = false
      }
    },
    async loadBalance() {
      try {
        const response = await apiClient.get('/users/balance')
        this.balance = response.data
      } catch (err) {
        showSnackbar('Failed to load balance')
        console.error(err)
      }
    },
    async transfer(phone: string, amount: number, purpose: string) {
      await apiClient.post('/users/transfer', { phone, amount, purpose })
      await this.loadBalance()
    },
  },
})
