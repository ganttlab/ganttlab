<template>
  <div class="pb-12">
    <div v-for="gateway in gateways" :key="gateway.slug">
      <div class="source" @click="setSource(gateway.slug)">
        <div class="flex items-center justify-between">
          <div class="flex-grow-0 leading-none mr-4">
            <Icon size="42" :name="gateway.icon" />
          </div>
          <div class="flex-grow">{{ gateway.name }}</div>
          <div class="flex-grow-0">&gt;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import Icon from '../../generic/Icon.vue';
import { ImplementedSourcesGateways } from '../../../helpers/ImplementedSourcesGateways';

@Component({
  components: {
    Icon,
  },
})
export default class GatewaysList extends Vue {
  gateways = ImplementedSourcesGateways;

  @Emit('set-source')
  setSource(source: string) {
    return source;
  }
}
</script>

<style scoped lang="scss">
.source {
  @apply cursor-pointer bg-lead-600 transition duration-200 ease-in w-full my-8 px-4 py-2 shadow rounded-lg text-2xl text-lead-100;
}

.source:hover {
  @apply bg-lead-500;
}
</style>
