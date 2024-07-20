<script setup lang="ts">
import { Validation } from '@/models/Validation';

const { validations } = defineProps<{
  size?: number;
  disabled?: boolean;
  validations?: Validation<number | undefined>[];
}>();

const model = defineModel<number | undefined>({
  required: true
});

function filterNumber() {
  const result = parseInt((model.value ?? "").toString().replace(/[^0-9]/,""));
  model.value = result ? result : undefined;
}

const errors = computed(() => validations?.filter(v => !v.rule(model.value)));
const errorMessages = computed(() => errors.value?.map(e => e.message).join("\n"));
const inputClass = computed(() => (errors.value && errors.value.length) ? "is-invalid" : "");
</script>

<template>
  <div>
    <label
      v-if="$slots.default"
      class="form-label"
    >
      <slot></slot>
    </label>
    <input
      v-model="model"
      type="text"
      class="form-control rounded-1"
      :class="inputClass"
      :="{ size, disabled }"
      style="max-width: max-content"
      @input="filterNumber"
      :title="errorMessages"
    />
  </div>
</template>