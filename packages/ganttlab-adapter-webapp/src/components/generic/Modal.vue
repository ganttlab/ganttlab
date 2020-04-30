<template>
  <div>
    <div
      class="fixed z-40 flex flex-wrap justify-center left-0 top-0 w-full h-full overflow-auto bg-gray-100 opacity-75"
    ></div>
    <div
      class="cursor-pointer fixed z-40 flex flex-wrap justify-center left-0 top-0 w-full h-full overflow-auto"
      @click="close()"
    >
      <div
        class="cursor-default m-auto w-192 max-w-3xl mt-16 bg-white inline-block shadow-lg rounded-lg"
        @click.stop
      >
        <div
          class="p-4 float-right cursor-pointer transition duration-200 ease-in hover:text-red-700"
          @click="close()"
        >
          <Icon size="24" name="close-circle-outline" />
        </div>
        <div class="p-4 bg-gray-200 rounded-t-lg">
          <slot name="header"></slot>
        </div>
        <div>
          <slot name="default"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Icon from './Icon.vue';
import { Component, Vue, Emit } from 'vue-property-decorator';

@Component({
  components: {
    Icon,
  },
})
export default class Modal extends Vue {
  @Emit()
  close() {
    return true;
  }
}
</script>
