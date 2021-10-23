<template>
  <div>
    <div class="w-full flex items-center justify-center mb-6">
      <a
        v-for="(milestone, i) in paginatedMilestones.list"
        :key="i"
        href="#"
        class="px-6 py-3 border-b border-gray-200 text-gray-400"
        :class="{ active: activeMilestone === i }"
        @click.prevent="setActiveMilestone(i)"
        >{{ milestone.name }}</a
      >
    </div>
    <div v-if="paginatedTasks && paginatedTasks.list.length">
      <TasksDisplay
        :paginatedTasks="paginatedTasks"
        @set-tasks-page="setTasksPage($event)"
      />
    </div>
    <div v-else class="w-full p-16">
      <NoData
        :project="project"
        :sourceUrl="sourceUrl"
        :viewGateway="viewGateway"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import TasksDisplay from './TasksDisplay.vue';
import NoData from '../gateways/views/NoData.vue';
import {
  PaginatedListOfMilestones,
  PaginatedListOfTasks,
  Project,
  SourceVisitor,
} from 'ganttlab-entities';

@Component({
  components: {
    TasksDisplay,
    NoData,
  },
})
export default class MilestonesDisplay extends Vue {
  @Prop() private activeMilestone!: number;
  @Prop() private paginatedMilestones!: PaginatedListOfMilestones;
  @Prop() private paginatedTasks!: PaginatedListOfTasks;
  @Prop() readonly project!: Project | null;
  @Prop() readonly sourceUrl!: string | null;
  @Prop() readonly viewGateway!: SourceVisitor<unknown> | null;

  @Emit('set-active-milestone')
  setActiveMilestone(index: number) {
    return index;
  }

  @Emit('set-milestones-page')
  setMilestonesPage(page: number) {
    return page;
  }

  @Emit('set-tasks-page')
  setTasksPage(page: number) {
    return page;
  }

  get previousPage(): number | null {
    if (this.paginatedMilestones && this.paginatedMilestones.previousPage) {
      return this.paginatedMilestones.previousPage;
    }
    return null;
  }

  get currentPage(): number | null {
    if (this.paginatedMilestones && this.paginatedMilestones.page) {
      return this.paginatedMilestones.page;
    }
    return null;
  }

  get nextPage(): number | null {
    if (this.paginatedMilestones && this.paginatedMilestones.nextPage) {
      return this.paginatedMilestones.nextPage;
    }
    return null;
  }

  get lastPage(): number | null {
    if (this.paginatedMilestones && this.paginatedMilestones.lastPage) {
      return this.paginatedMilestones.lastPage;
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
.active {
  @apply border-b-2 border-lead-600 text-lead-600 font-bold;
}
</style>
