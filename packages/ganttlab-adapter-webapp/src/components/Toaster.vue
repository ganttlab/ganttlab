<template>
  <div class="z-50 fixed top-0 right-0 m-6">
    <transition name="slide-fade">
      <div
        v-if="message"
        class="cursor-pointer max-w-sm border-l-4 rounded px-4 py-3 shadow-md"
        :class="{
          error: type === 'error',
          success: type === 'success',
        }"
        role="alert"
        @click.prevent="clearMessage(message)"
      >
        <div class="flex">
          <div class="py-2 pr-4 icon">
            <Icon size="36" name="alert-circle-outline" />
          </div>
          <div>
            <p class="font-bold">{{ message.title }}</p>
            <p class="text-sm leading-snug">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Icon from './generic/Icon.vue';
import { getModule } from 'vuex-module-decorators';
import MainModule from '../store/modules/MainModule';
import { DisplayableError } from '../helpers/DisplayableError';

const mainState = getModule(MainModule);

@Component({
  components: {
    Icon,
  },
})
export default class Toaster extends Vue {
  type = 'error';
  message: DisplayableError | null = null;
  messages: Array<DisplayableError> = [];

  clearMessage(message: DisplayableError) {
    this.message = null;
    mainState.clearError(message);
  }

  get errors(): Array<DisplayableError> {
    return mainState.errors;
  }

  @Watch('errors')
  onErrorsChange(errors: Array<DisplayableError>) {
    if (errors.length) {
      const message = errors[0];
      this.message = message;
      setTimeout(() => {
        this.clearMessage(message);
      }, 10000);
    }
  }
}
</script>

<style scoped lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

.error {
  @apply bg-red-100 border-red-500 text-red-900;

  .icon {
    @apply text-red-600;
  }
}
.success {
  @apply bg-green-100 border-green-500 text-green-900;

  .icon {
    @apply text-green-600;
  }
}
</style>
