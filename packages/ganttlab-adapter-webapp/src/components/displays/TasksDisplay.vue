<template>
  <div>
    <div
      v-if="previousPage || nextPage"
      class="w-full flex items-center justify-center -mb-10 text-gray-600"
    >
      <Paginator
        :previousPage="previousPage"
        :currentPage="currentPage"
        :nextPage="nextPage"
        :lastPage="lastPage"
        @set-page="setTasksPage($event)"
      />
    </div>
    <TasksChartMediator :tasks="paginatedTasks.list" :chart="chart" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import MainModule from '../../store/modules/MainModule';
import TasksChartMediator from '../gateways/charts/TasksChartMediator.vue';
import Paginator from '../generic/Paginator.vue';
import { PaginatedListOfTasks } from 'ganttlab-entities';

const mainState = getModule(MainModule);
const defaultChart = 'legacy';

@Component({
  components: {
    TasksChartMediator,
    Paginator,
  },
})
export default class TasksDisplay extends Vue {
  @Prop() private paginatedTasks!: PaginatedListOfTasks;

  @Emit('set-tasks-page')
  setTasksPage(page: number) {
    return page;
  }

  get previousPage(): number | null {
    if (this.paginatedTasks && this.paginatedTasks.previousPage) {
      return this.paginatedTasks.previousPage;
    }
    return null;
  }

  get currentPage(): number | null {
    if (this.paginatedTasks && this.paginatedTasks.page) {
      return this.paginatedTasks.page;
    }
    return null;
  }

  get nextPage(): number | null {
    if (this.paginatedTasks && this.paginatedTasks.nextPage) {
      return this.paginatedTasks.nextPage;
    }
    return null;
  }

  get lastPage(): number | null {
    if (this.paginatedTasks && this.paginatedTasks.lastPage) {
      return this.paginatedTasks.lastPage;
    }
    return null;
  }

  // chart name is stored in vuex store
  get chart(): string {
    if (!mainState.chart) {
      // save and use default if not set yet
      this.chart = defaultChart;
      return defaultChart;
    }
    return mainState.chart;
  }
  set chart(chart: string) {
    mainState.setChart(chart);
  }
}
</script>
