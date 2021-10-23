<template>
  <div class="flex items-center justify-center">
    <NoDataIllustration width="125" />
    <div class="ml-12">
      <p class="font-lead text-3xl">There's no task out there!</p>
      <p class="text-gray-600 text-sm">
        Fill in some tasks in
        <a
          v-if="project"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="border-dotted border-b border-gray-600 hover:border-lead-700"
          >your project</a
        >
        <a
          v-else
          :href="sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="border-dotted border-b border-gray-600 hover:border-lead-700"
          >your source</a
        >, or pick another view
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import NoDataIllustration from '../../generic/illustrations/NoData.vue';
import { trackInteractionEvent } from '../../../helpers/GTM';
import { Project, SourceVisitor } from 'ganttlab-entities';

@Component({
  components: {
    NoDataIllustration,
  },
})
export default class NoData extends Vue {
  @Prop() readonly project!: Project | null;
  @Prop() readonly sourceUrl!: string | null;
  @Prop() readonly viewGateway!: SourceVisitor<unknown> | null;

  mounted() {
    trackInteractionEvent(
      'View',
      'No data',
      this.viewGateway ? this.viewGateway.slug : undefined,
    );
  }
}
</script>
