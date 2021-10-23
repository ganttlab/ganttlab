<template>
  <div>
    <div class="mb-20 text-center">
      <Icon size="64" name="logo-github" />
    </div>
    <div class="mb-20">
      <GenericInput type="password" v-model="credentials.token">
        <p slot="label">
          A
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            >Personal Access Token</a
          >
          with the
          <span class="font-normal text-lead-800">repo</span> scope
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
import { GitHubGateway } from 'ganttlab-gateways';
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
    token: '',
  };

  // implementing abstract getSourceGateway
  getSourceGateway() {
    return new GitHubGateway();
  }

  // from there, this logic is totally specific to the GitHub Login vue
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
