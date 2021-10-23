<template>
  <div>
    <div class="hidden lg:block">
      <div class="flex shadow-lg bg-gray-200 rounded-lg">
        <div class="w-112 p-10">
          <div class="flex justify-start items-center -ml-2 pb-4">
            <Icon class="text-gray-500 mr-2" size="70" name="logo-ganttlab" />
            <h1 class="text-5xl font-lead leading-none mt-2">GanttLab</h1>
          </div>
          <h2 class="text-2xl font-lead">
            The easy to use, fully functional Gantt chart for GitLab and GitHub.
          </h2>
          <h3 class="pt-10 pb-16">
            Provide your teams with the right tool to master time and deadlines.
            Giving back credit to your project status and issues due dates has
            never been easier!
          </h3>
          <p class="w-full pt-1 text-sm text-center text-gray-600">
            By using this service you accept our
            <a
              href="https://www.ganttlab.com/privacy/"
              target="_blank"
              rel="noopener"
              @click="goToPrivacy"
              >Privacy Policy</a
            >
          </p>
          <div class="flex pt-4 text-sm text-gray-600">
            <div class="w-2/3">
              <p>
                <a
                  href="https://www.ganttlab.com"
                  target="_blank"
                  rel="noopener"
                  @click="goToReadMore"
                >
                  Read more about GanttLab
                  <Icon size="14" class="mb-1" name="open-outline" />
                </a>
              </p>
              <p class="text-xs">
                © 2016-{{ new Date().getFullYear() }}
                <a
                  href="https://clorichel.com/"
                  target="_blank"
                  rel="noopener"
                  @click="goToAuthor"
                  >Pierre-Alexandre Clorichel</a
                >
              </p>
            </div>
            <div class="w-1/3 text-right">
              <p>
                <a
                  href="https://gitlab.com/ganttlab/ganttlab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="goToContribute"
                >
                  Contribute
                  <Icon size="14" class="mb-1" name="open-outline" />
                </a>
              </p>
              <p>
                <a
                  href="https://twitter.com/GanttLab"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="goToTwitter"
                >
                  Twitter
                  <Icon size="14" class="mb-1" name="logo-twitter" />
                </a>
              </p>
            </div>
          </div>
        </div>
        <div class="w-112 p-10 bg-white rounded-r-md">
          <div class="flex flex-wrap h-full content-end">
            <transition name="component-fade" mode="out-in">
              <GatewaysList
                v-if="source === null"
                class="w-full"
                @set-source="setSource($event)"
              />
              <SourceAuthenticate
                v-else
                class="w-full"
                :source="source"
                @signing-in="signingIn"
                @signin-error="signinError"
                @set-step="forceStep($event)"
              />
            </transition>
            <Steps3
              class="w-full mt-8"
              :current="currentStep"
              @set-step="forceStep($event)"
            >
              <p slot="step1">
                Select your
                <br />data source
              </p>
              <p slot="step2">Authenticate</p>
              <p slot="step3">
                Get your
                <br />Gantt chart!
              </p>
            </Steps3>
          </div>
        </div>
      </div>
    </div>
    <div class="block lg:hidden flex flex-col h-screen">
      <div class="bg-gray-200 p-2 shadow-md">
        <div class="flex justify-center items-center">
          <Icon class="text-gray-500 mr-2" size="56" name="logo-ganttlab" />
          <h1 class="text-4xl font-lead leading-none">GanttLab</h1>
        </div>
      </div>
      <div class="flex-grow p-2 mt-6">
        <Steps3
          class="w-full"
          :current="currentStep"
          @set-step="forceStep($event)"
        >
          <p slot="step1">
            Select your
            <br />data source
          </p>
          <p slot="step2">Authenticate</p>
          <p slot="step3">
            Get your
            <br />Gantt chart!
          </p>
        </Steps3>
        <transition name="component-fade" mode="out-in">
          <GatewaysList
            v-if="source === null"
            class="w-full px-6 mt-20"
            @set-source="source = $event"
          />
          <SourceAuthenticate
            v-else
            class="w-full mt-8"
            :source="source"
            @signing-in="signingIn"
            @signin-error="signinError"
            @set-step="forceStep($event)"
          />
        </transition>
      </div>
      <div class="bg-gray-200 px-2 py-6">
        <p class="w-full mb-6 text-sm text-center">
          By using this service you accept our
          <a
            href="https://www.ganttlab.com/privacy/"
            target="_blank"
            rel="noopener"
            @click="goToPrivacy"
            >Privacy Policy</a
          >
        </p>
        <div class="flex items-center justify-between text-sm mb-6 px-4">
          <a
            href="https://www.ganttlab.com"
            target="_blank"
            rel="noopener"
            @click="goToReadMore"
          >
            Read more
            <Icon size="14" class="mb-1" name="open-outline" />
          </a>
          <a
            href="https://gitlab.com/ganttlab/ganttlab/"
            target="_blank"
            rel="noopener noreferrer"
            @click="goToContribute"
          >
            Contribute
            <Icon size="14" class="mb-1" name="open-outline" />
          </a>
          <a
            href="https://twitter.com/GanttLab"
            target="_blank"
            rel="noopener noreferrer"
            @click="goToTwitter"
          >
            Twitter
            <Icon size="14" class="mb-1" name="logo-twitter" />
          </a>
        </div>
        <p class="text-xs text-center">
          © 2016-{{ new Date().getFullYear() }}
          <a
            href="https://clorichel.com/"
            target="_blank"
            rel="noopener"
            @click="goToAuthor"
            >Pierre-Alexandre Clorichel</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import Icon from './generic/Icon.vue';
import GatewaysList from './gateways/sources/GatewaysList.vue';
import SourceAuthenticate from './gateways/sources/Authenticate.vue';
import Steps3 from './generic/steps/Steps3.vue';
import { getModule } from 'vuex-module-decorators';
import MainModule from '../store/modules/MainModule';
import { User } from 'ganttlab-entities';
import LocalForage, {
  getRememberedSource,
  getRememberedCredentials,
} from '../helpers/LocalForage';
import { trackVirtualpageView, trackInteractionEvent } from '../helpers/GTM';

const mainState = getModule(MainModule);

@Component({
  components: {
    Icon,
    GatewaysList,
    SourceAuthenticate,
    Steps3,
  },
})
export default class Welcome extends Vue {
  source: string | null = null;
  authenticating = false;
  authenticated = false;

  @Prop({ type: Boolean, default: false }) readonly justLoggedOut!: boolean;

  async created() {
    // when created, fill vuex store with remembered data
    // created hook is executed synchronously! here we don't actually care
    // that vuex is filled later, on resolve
    mainState.setCredentialsBySource(await getRememberedCredentials());
    mainState.setRemember(await LocalForage.getItem('remember'));
  }

  mounted() {
    this.$nextTick(async () => {
      if (!this.justLoggedOut) {
        this.source = await getRememberedSource();
      }
    });
    trackVirtualpageView('Welcome', '/welcome');
  }

  signingIn() {
    trackInteractionEvent(
      'Authentication',
      'Authenticating',
      this.source ? this.source : undefined,
    );
    this.authenticating = true;
  }

  signinError() {
    trackInteractionEvent(
      'Authentication',
      'Error authenticating',
      this.source ? this.source : undefined,
    );
    this.authenticating = false;
  }

  setSource(source: string) {
    trackInteractionEvent('Authentication', 'Selected Source', source);
    this.source = source;
  }

  forceStep(step: number) {
    if (step === 1) {
      trackInteractionEvent(
        'Authentication',
        'Back to list',
        this.source ? this.source : undefined,
      );
      this.source = null;
    }
  }

  get currentStep(): number {
    if (this.source === null) return 1;
    if (this.authenticating === false) return 2;
    if (this.authenticated === true) return 4;
    return 3;
  }

  get user(): User | null {
    return mainState.user;
  }

  @Watch('user')
  onUserChange(user: User | null) {
    if (user) {
      this.authenticated = true;
    }
  }

  goToReadMore() {
    trackInteractionEvent('Click', 'Read more');
  }

  goToAuthor() {
    trackInteractionEvent('Click', 'Author');
  }

  goToContribute() {
    trackInteractionEvent('Click', 'Contribute');
  }

  goToTwitter() {
    trackInteractionEvent('Click', 'Twitter');
  }

  goToPrivacy() {
    trackInteractionEvent('Click', 'Privacy');
  }
}
</script>
