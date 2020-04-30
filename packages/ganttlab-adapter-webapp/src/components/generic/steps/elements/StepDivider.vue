<template>
  <span
    class="transition duration-500 ease-in m-auto rounded-lg bg-gray-200 h-1 flex items-center justify-center"
    :class="{ 'bg-green-200': isDone }"
  ></span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StepDivider extends Vue {
  @Prop({ type: Boolean, default: false }) private isDone!: boolean;
}
</script>
