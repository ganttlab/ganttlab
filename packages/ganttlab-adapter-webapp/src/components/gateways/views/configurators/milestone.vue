<template>
  <div class="relative">
    <RepositoryViewConfigurator
      v-if="sourceGateway.slug === 'github'"
      :sourceGateway="sourceGateway"
      @set-configuration="setProjectConfiguration($event)"
    />
    <ProjectViewConfigurator
      v-if="sourceGateway.slug === 'gitlab'"
      :sourceGateway="sourceGateway"
      @set-configuration="setProjectConfiguration($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import RepositoryViewConfigurator from './repository.vue';
import ProjectViewConfigurator from './project.vue';
import { Configuration, Source } from 'ganttlab-entities';

@Component({
  components: {
    RepositoryViewConfigurator,
    ProjectViewConfigurator,
  },
})
export default class MilestoneViewConfigurator extends Vue {
  private projectConfiguration: Configuration | null = null;

  @Prop({ required: true }) readonly sourceGateway!: Source;

  setProjectConfiguration(configuration: Configuration) {
    this.projectConfiguration = configuration;
    this.setConfiguration();
  }

  get configuration() {
    if (this.projectConfiguration) {
      return {
        ...this.projectConfiguration,
        milestones: {
          page: 1,
          pageSize: 50,
        },
        activeMilestone: 0,
      };
    }
    return null;
  }

  @Emit('set-configuration')
  setConfiguration() {
    const configuration = this.configuration;
    if (configuration) {
      return this.configuration;
    }
  }
}
</script>
