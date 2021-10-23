<template>
  <div class="cursor-default">
    <div class="flex w-full text-xs items-center pb-2">
      <div
        class="w-1/5"
        :class="{ 'cursor-pointer': current > 1 }"
        @click="setStep(1)"
      >
        <StepNumber
          number="1"
          :isActive="current === 1"
          :isDone="current > 1"
        />
      </div>
      <div class="w-1/5">
        <StepDivider :isDone="current > 1" />
      </div>
      <div
        class="w-1/5"
        :class="{ 'cursor-pointer': current > 2 }"
        @click="setStep(2)"
      >
        <StepNumber
          number="2"
          :isActive="current === 2"
          :isDone="current > 2"
        />
      </div>
      <div class="w-1/5">
        <StepDivider :isDone="current > 2" />
      </div>
      <div
        class="w-1/5"
        :class="{ 'cursor-pointer': current > 3 }"
        @click="setStep(3)"
      >
        <StepNumber
          number="3"
          :isActive="current === 3"
          :isDone="current > 3"
        />
      </div>
    </div>
    <div class="flex w-full text-center text-xs leading-tight items-center">
      <div
        class="w-1/5 transition duration-500 ease-in"
        :class="{
          'text-green-500': current > 1,
          'text-gray-500': current < 1,
          'cursor-pointer': current > 1,
        }"
        @click="setStep(1)"
      >
        <slot name="step1"></slot>
      </div>
      <div class="w-1/5"></div>
      <div
        class="w-1/5 transition duration-500 ease-in"
        :class="{
          'text-green-500': current > 2,
          'text-gray-500': current < 2,
          'cursor-pointer': current > 2,
        }"
        @click="setStep(2)"
      >
        <slot name="step2"></slot>
      </div>
      <div class="w-1/5"></div>
      <div
        class="w-1/5 transition duration-500 ease-in"
        :class="{
          'text-green-500': current > 3,
          'text-gray-500': current < 3,
          'cursor-pointer': current > 3,
        }"
        @click="setStep(3)"
      >
        <slot name="step3"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import StepNumber from './elements/StepNumber.vue';
import StepDivider from './elements/StepDivider.vue';

@Component({
  components: {
    StepNumber,
    StepDivider,
  },
})
export default class Steps3 extends Vue {
  step = 1;

  @Prop({ type: Number, default: 1 }) private current!: number;

  setStep(step: number) {
    if (this.current > step) this.$emit('set-step', step);
  }
}
</script>
