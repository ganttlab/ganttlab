<template>
  <div class="w-full">
    <component
      v-if="chart && tasks.length"
      :is="chartComponent"
      :tasks="tasks"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import legacyChart from '../../gateways/charts/legacy/Chart.vue';
import { Task } from 'ganttlab-entities';

@Component({
  components: {
    legacyChart,
  },
})
export default class TasksChartMediator extends Vue {
  @Prop() readonly tasks!: Array<Task>;
  @Prop() readonly chart!: string;

  get chartComponent() {
    return `${this.chart}Chart`;
  }
}
</script>
