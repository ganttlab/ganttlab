<template>
  <div>
    <div class="mb-8 text-center">
      <Icon size="64" name="logo-gitlab" />
    </div>
    <div class="mb-8">
      <GenericInput v-model="credentials.instance">
        <p slot="label">Your GitLab instance URL</p>
      </GenericInput>
    </div>
    <div class="mb-8">
      <GenericInput type="password" v-model="credentials.token">
        <p slot="label">
          A
          <a :href="personalTokenLink" target="_blank" rel="noopener noreferrer"
            >Personal Access Token</a
          >
          with the
          <span class="font-normal text-lead-800">api</span> scope only
        </p>
      </GenericInput>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import Icon from '../../../generic/Icon.vue';
import GenericInput from '../../../generic/forms/Input.vue';
import LoginMixin from '../abstracts/LoginMixin';
import { GitLabGateway } from 'ganttlab-gateways';
import { Credentials } from 'ganttlab-entities';

@Component({
  components: {
    Icon,
    GenericInput,
  },
})
export default class Login extends Mixins(LoginMixin) {
  // implementing abstract defaultCredentials with appropriate structure
  public defaultCredentials: Credentials = {
    instance: 'https://gitlab.com',
    token: '',
  };

  // implementing abstract getSourceGateway
  getSourceGateway() {
    return new GitLabGateway();
  }

  // from there, this logic is totally specific to the GitLab Login vue
  get personalTokenLink() {
    if (this.credentials.instance) {
      return `${this.credentials.instance.replace(
        /\/$/,
        '',
      )}/-/profile/personal_access_tokens`;
    }
    return null;
  }
}
</script>

<style scoped lang="scss">
a {
  @apply border-dotted border-b border-gray-600;
}
a:hover {
  @apply border-lead-700;
}
</style>
