<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  },
)

const emit = defineEmits(['click'])

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button class="app-button" :disabled="props.disabled" @click="handleClick" :type="props.type">
    <slot> Button </slot>
  </button>
</template>

<style scoped>
.app-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 12px 22px;
  border: none;
  border-radius: 12px;

  background: linear-gradient(135deg, rgba(120, 140, 80, 0.9), rgba(150, 170, 110, 0.9));
  color: #f4f4f4;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(100, 120, 80, 0.25);
}

.app-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(100, 120, 80, 0.35);
  background: linear-gradient(135deg, rgba(100, 120, 60, 0.95), rgba(130, 150, 90, 0.95));
}

.app-button:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(100, 120, 80, 0.2);
}

.app-button .icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
