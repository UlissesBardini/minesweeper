<script setup lang="ts">
type ButtonType =  "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link";
type ButtonSize = "sm" | "lg";

const { type = "primary", size, outline, active } = defineProps<{
  type?: ButtonType,
  size?: ButtonSize,
  outline?: boolean
  active?: boolean,
}>();

const btnClass = computed(() => `btn rounded-1 btn-${outline ? 'outline-' : ''}${type}${size ? ` btn-${size}` : ''}${active ? ` active` : ''}`);
</script>

<template>
  <button
    :class="btnClass"
    :="$attrs"
    style="height: fit-content"
  >
    <slot></slot>
  </button>
</template>