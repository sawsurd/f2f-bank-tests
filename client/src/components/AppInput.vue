<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    type?: 'text' | 'number' | 'email' | 'password'
    name: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    placeholder: 'Type your message...',
    disabled: false,
    type: 'text',
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'enter'): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('enter')
  }
}
</script>

<template>
  <input
    class="input"
    :name="props.name"
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :required="props.required"
    @input="onInput"
    @keydown="onKeydown"
  />
</template>

<style scoped>
.input {
  display: flex;
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(120, 140, 80, 0.7);
  background-color: rgba(200, 210, 180, 0.25);
  color: #3b5d35;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.input::placeholder {
  color: rgba(58, 107, 53, 0.6);
}

.input:hover {
  background-color: rgba(200, 210, 180, 0.35);
  border-color: rgba(120, 140, 80, 0.9);
}

.input:focus {
  background-color: rgba(200, 210, 180, 0.4);
  border-color: #4a7a45;
  box-shadow: 0 0 6px rgba(74, 122, 69, 0.4);
}

@media (prefers-color-scheme: dark) {
  .input {
    color: #d4e8c8;
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(160, 190, 120, 0.45);
  }

  .input::placeholder {
    color: rgba(180, 215, 155, 0.55);
  }

  .input:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(160, 190, 120, 0.7);
  }

  .input:focus {
    background-color: rgba(255, 255, 255, 0.14);
    border-color: #7aaa70;
    box-shadow: 0 0 6px rgba(122, 170, 112, 0.4);
  }
}
</style>
