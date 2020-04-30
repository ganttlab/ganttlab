<template>
  <div>
    <label class="cursor-pointer flex justify-start items-start">
      <div
        class="shadow bg-white border rounded border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
      >
        <input
          type="checkbox"
          :id="id"
          v-model="syncedValue"
          class="cursor-pointer opacity-0 absolute"
        />
        <svg
          class="fill-current hidden w-4 h-4 text-lead-600 pointer-events-none"
          viewBox="0 0 20 20"
        >
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
      </div>
      <div class="select-none text-gray-700 text-sm leading-normal font-bold">
        <slot name="label"></slot>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class Checkbox extends Vue {
  public syncedValue = false;

  @Prop(String) private id!: string;
  @Prop(Boolean) readonly value!: boolean;

  mounted() {
    this.$nextTick(() => {
      this.syncedValue = this.value;
    });
  }

  @Watch('syncedValue')
  onValueChanged(val: string) {
    this.$emit('input', val);
  }
}
</script>

<style scoped>
input:checked + svg {
  display: block;
}
</style>
