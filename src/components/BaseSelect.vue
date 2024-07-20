<script setup lang="ts" generic="T extends {[key: string]: any} | string, U extends {[key: string]: any} | string">

const {
  options,
  optionLabel,
  map
} = defineProps<{
  /** The array of the options */
  options: T[],
  /** The property of the option that will be used as the label.
   * Use only if options is an array of objects
  */
  optionLabel?: string,
  /** A mapping function to map the selected value to another value */
  map?: (o: T) => U
}>();

const model = defineModel<U>({ required: true });

function getOptionLabel(option: T) {
  if (typeof option === 'string') {
    return option;
  }
  return optionLabel ? option[optionLabel] : option;
}
</script>

<template>
  <div>
    <label
      v-if="$slots.default"
      class="form-label"
    >
      <slot></slot>
    </label>
    <select style="width: max-content;" class="form-select rounded-1" v-model="model">
      <option
        v-for="option in options"
        :key="getOptionLabel(option)"
        :value="map ? map(option) : option"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </div>
</template>