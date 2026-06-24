<script lang="ts" setup>
import ProfileInfo from '@/components/ProfileInfo.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div class="profile">
    <div class="profile__card">
      <div class="avatar">
        <svg viewBox="0 0 24 24">
          <path
            d="M17 8C8 10 5 16 5 20c4 0 10-3 12-12zM17 8c2-3 2-5 2-6-1 1-3 2-6 2 0 0 2 2 4 4z"
          />
        </svg>
      </div>
      <ProfileInfo
        :name="userStore.profile?.name ?? ''"
        :surname="userStore.profile?.surname ?? ''"
        :email="userStore.profile?.email ?? ''"
      />
    </div>
  </div>
</template>

<style scoped>
.profile {
  height: 78vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(200, 210, 180, 0.3);
  font-family: Arial, sans-serif;
}

.profile__card {
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #c8d2b4;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
}

.avatar svg {
  width: 60px;
  height: 60px;
  fill: #5a6b3c;
}

.profile__info {
  text-align: left;
}

@media (prefers-color-scheme: dark) {
  .profile {
    background: transparent;
  }

  .profile__card {
    background: #2a3828;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
}
</style>
