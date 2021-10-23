<template>
  <div class="relative">
    <GenericAutocomplete
      :search="search"
      :loading="loading"
      :results="repositories"
      :focus="true"
      @search="searchRepositories"
      @select-result="setRepository"
    >
      <p slot="label">Search for a repository</p>
      <template v-slot:no-result="slotProps">
        <p>No repository found while searching for</p>
        <p>
          «
          <span class="font-bold">{{ slotProps.searched }}</span> »
        </p>
        <p class="mt-4 text-gray-600">
          Try searching for «
          <a
            class="font-bold"
            href="#"
            @click.prevent="
              repositories = null;
              search = 'ganttlab';
            "
            >ganttlab</a
          >
          »
        </p>
      </template>
      <template v-slot:result="slotProps">
        <div class="flex items-center justify-start">
          <img
            v-if="slotProps.result.owner.avatar_url"
            :src="slotProps.result.owner.avatar_url"
            :alt="slotProps.result.full_name"
            class="flex-shrink-0 w-12 h-12 mr-3 rounded bg-white shadow"
          />
          <div
            v-else
            class="flex-shrink-0 w-12 h-12 p-2 mr-3 rounded bg-gray-200 text-gray-600"
          >
            <Icon size="32" name="cube-outline" />
          </div>
          <p class="flex-shrink truncate">
            <span class="font-bold">{{ slotProps.result.full_name }}</span>
            <br />
            <span class="text-sm">{{ slotProps.result.description }}</span>
          </p>
        </div>
      </template>
    </GenericAutocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import GenericAutocomplete from '../../../generic/forms/Autocomplete.vue';
import Icon from '../../../generic/Icon.vue';
import { DisplayableError } from '../../../../helpers/DisplayableError';
import { addDisplaybleError } from '../../../../helpers';
import { GitHubGateway, GitHubRepository } from 'ganttlab-gateways';
import { Project } from 'ganttlab-entities';

@Component({
  components: {
    GenericAutocomplete,
    Icon,
  },
})
export default class RepositoryViewConfigurator extends Vue {
  public search = '';
  public loading = false;
  public repositories: Array<GitHubRepository> | null = null;
  public repository: GitHubRepository | null = null;

  @Prop({ required: true }) readonly sourceGateway!: GitHubGateway;

  async searchRepositories(newSearch: string) {
    this.search = newSearch;
    if (!newSearch) {
      // empty search? empty repositories!
      this.repositories = null;
      return;
    }
    if (this.repository && newSearch === this.repository.full_name) {
      // same? do nothing!
      return;
    }
    try {
      this.loading = true;
      this.repositories = await this.sourceGateway.searchRepositories(
        newSearch,
      );
      this.loading = false;
    } catch (error) {
      this.repositories = null;
      this.loading = false;
      addDisplaybleError(
        new DisplayableError(error, 'Error while searching for that'),
      );
    }
  }

  setRepository(repository: GitHubRepository) {
    if (this.repository && this.repository.full_name === repository.full_name) {
      // same? do nothing!
      return;
    }
    this.repository = repository;
    this.setConfiguration();
  }

  get configuration() {
    if (this.repository) {
      return {
        project: new Project(
          this.repository.name,
          this.repository.full_name,
          this.repository.html_url,
          this.repository.description,
          this.repository.owner.avatar_url,
        ),
        tasks: {
          page: 1,
          pageSize: 50,
        },
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
