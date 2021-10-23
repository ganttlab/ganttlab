<template>
  <span
    class="transition duration-500 ease-in m-auto rounded-full h-5 w-5 flex items-center justify-center text-gray-500 bg-gray-200"
    :class="{ active: isActive, done: isDone }"
    >{{ number }}</span
  >
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StepNumber extends Vue {
  @Prop(String) private number!: string;
  @Prop({ type: Boolean, default: false }) private isActive!: boolean;
  @Prop({ type: Boolean, default: false }) private isDone!: boolean;
}
</script>

<style scoped lang="scss">
.active {
  @apply text-black border border-gray-400 bg-white;
}

.done {
  @apply text-green-500 border border-green-200 bg-green-100;
}
</style>
