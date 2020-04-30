<template>
  <button
    class="cursor-pointer bg-lead-600 hover:bg-lead-500 transition duration-200 ease-in py-1 px-4 shadow rounded-md text-lead-100 focus:outline-none focus:bg-lead-500"
    @click="clicked($event)"
  >
    <slot name="label"></slot>
  </button>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Emit()
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  clicked(e: any) {
    return e.target.value;
  }
}
</script>
