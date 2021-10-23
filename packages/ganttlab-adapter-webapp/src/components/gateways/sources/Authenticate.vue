<template>
  <div>
    <transition name="component-fade" mode="out-in">
      <div
        v-if="authenticating"
        key="spinner"
        class="w-full h-64 mb-12 flex items-center justify-center text-lead-600"
      >
        <Spinner size="64" />
      </div>
      <div v-else key="authenticator">
        <component
          v-if="displayLoginComponent"
          :is="loginComponent"
          v-model="credentials"
          @source-gateway="setSourceGateway($event)"
        />
        <div class="flex items-center">
          <a
            href="#"
            @click.prevent="setStep(1)"
            class="flex-grow text-sm text-gray-500"
            >&lt; Back</a
          >
          <div class="mr-8">
            <GenericCheckbox v-model="remember">
              <p slot="label">Remember me</p>
            </GenericCheckbox>
          </div>
          <div>
            <GenericButton @clicked="doSignIn()">
              <p slot="label">Sign-in &gt;</p>
            </GenericButton>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import gitlabLogin from './gitlab/Login.vue';
import githubLogin from './github/Login.vue';
import GenericCheckbox from '../../generic/forms/Checkbox.vue';
import GenericButton from '../../generic/forms/Button.vue';
import Spinner from '../../generic/Spinner.vue';
import { getModule } from 'vuex-module-decorators';
import MainModule from '../../../store/modules/MainModule';
import LocalForage from '../../../helpers/LocalForage';
import { SignIn } from '../../../helpers/SignIn';
import { AuthenticatableSource, Credentials } from 'ganttlab-entities';
import { trackInteractionEvent } from '../../../helpers/GTM';

const mainState = getModule(MainModule);

@Component({
  components: {
    gitlabLogin,
    githubLogin,
    GenericCheckbox,
    GenericButton,
    Spinner,
  },
})
export default class Authenticate extends Vue {
  displayLoginComponent = false;
  authenticating = false;
  sourceGateway: AuthenticatableSource | null = null;

  private credentials: Credentials = {};

  @Prop(String) private source!: string;

  // adding convenient sign-in on Enter key
  windowKeyup(event: KeyboardEvent) {
    if (event.key && event.key === 'Enter') {
      this.doSignIn();
    }
  }
  created() {
    window.addEventListener('keyup', this.windowKeyup);
  }
  destroyed() {
    window.removeEventListener('keyup', this.windowKeyup);
  }

  async mounted() {
    this.$nextTick(() => {
      const mainStateCredentials = mainState.getSourceCredentials(this.source);
      if (mainStateCredentials) {
        // credentials are in vuex store? use those!
        for (const key in mainStateCredentials) {
          Vue.set(this.credentials, key, mainStateCredentials[key]);
        }
      }
      this.displayLoginComponent = true;
    });
  }

  get loginComponent() {
    return `${this.source}Login`;
  }

  @Watch('credentials', { deep: true })
  onSyncedCredentialsChanged(newCredentials: Credentials) {
    const sourcedCredential: {
      [key: string]: Credentials;
    } = {};
    sourcedCredential[this.source] = newCredentials;
    // save credentials in vuex upon change
    mainState.setCredentials(sourcedCredential);
  }

  // remember status is stored in vuex store
  get remember(): boolean {
    return mainState.remember;
  }
  set remember(remember: boolean) {
    mainState.setRemember(remember);
  }

  @Emit('set-step')
  setStep(step: number) {
    return step;
  }

  async doSignIn() {
    trackInteractionEvent(
      'Authentication',
      'With remember?',
      this.remember ? 'true' : 'false',
    );
    this.authenticating = true;
    this.$emit('signing-in', true);
    if (this.sourceGateway) {
      if (!(await SignIn(this.sourceGateway, this.credentials))) {
        this.$emit('signin-error', true);
      }
      LocalForage.setItem('remember', this.remember);
      if (this.remember) {
        await LocalForage.setItem(
          'source',
          this.sourceGateway ? this.sourceGateway.slug : null,
        );
        await LocalForage.setItem(
          'credentialsBySource',
          mainState.credentialsBySource,
        );
      } else {
        LocalForage.removeItem('source');
        LocalForage.removeItem('credentialsBySource');
        LocalForage.removeItem('viewsBySource');
      }
    }
    this.authenticating = false;
  }

  setSourceGateway(sourceGateway: AuthenticatableSource) {
    this.sourceGateway = sourceGateway;
  }
}
</script>
