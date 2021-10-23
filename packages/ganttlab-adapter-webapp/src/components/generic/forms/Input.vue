<template>
  <div>
    <input
      ref="inputEl"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-lead-600"
      :id="id"
      :type="type"
      :disabled="disabled"
      v-model="syncedValue"
    />
    <label class="block text-gray-700 text-sm font-bold mt-1" :for="id">
      <slot name="label"></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Input extends Vue {
  public syncedValue = '';

  @Prop({ type: String, default: 'text' }) private type!: string;
  @Prop({ type: Boolean, default: false }) private disabled!: boolean;
  @Prop({ type: Boolean, default: false }) private focused!: boolean;
  @Prop(String) private id!: string;
  @Prop({ type: String }) readonly value!: string;

  mounted() {
    ['keyup', 'keydown', 'keypress'].forEach((event) => {
      const el = this.$refs.inputEl as HTMLElement;
      el.addEventListener(event, ($event) => this.$emit(event, $event));
    });
    this.$nextTick(() => {
      this.syncedValue = this.value;
    });
  }

  @Watch('syncedValue')
  onSyncedValueChanged(val: string) {
    this.$emit('input', val);
  }

  @Watch('value')
  onValueChanged() {
    this.syncedValue = this.value;
  }
}
</script>
