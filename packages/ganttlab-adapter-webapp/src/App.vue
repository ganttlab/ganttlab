<template>
  <div id="app" class="text-black">
    <div class="flex h-screen">
      <transition name="component-fade" mode="out-in">
        <div
          v-if="bypassWelcome"
          key="spinner"
          class="w-full h-screen mb-12 flex items-center justify-center text-lead-600"
        >
          <Spinner size="64" />
        </div>
        <Home v-else-if="user" />
        <Welcome
          v-else
          :justLoggedOut="justLoggedOut"
          class="w-full lg:m-auto lg:w-auto"
        />
      </transition>
      <Toaster />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Spinner from './components/generic/Spinner.vue';
import Home from './components/Home.vue';
import Welcome from './components/Welcome.vue';
import Toaster from './components/Toaster.vue';
import { getModule } from 'vuex-module-decorators';
import MainModule from './store/modules/MainModule';
import { User, Credentials, AuthenticatableSource } from 'ganttlab-entities';
import LocalForage, {
  getRememberedCredentials,
  getRememberedSource,
} from './helpers/LocalForage';
import { getBySlug } from './helpers/ImplementedSourcesGateways';
import { SignIn } from './helpers/SignIn';
import { trackInteractionEvent } from './helpers/GTM';

const mainState = getModule(MainModule);

@Component({
  components: {
    Spinner,
    Home,
    Welcome,
    Toaster,
  },
})
export default class App extends Vue {
  private bypassWelcome = true;

  get justLoggedOut(): boolean {
    return mainState.justLoggedOut;
  }

  get user(): User | null {
    return mainState.user;
  }

  @Watch('user')
  onUserChange(user: User | null) {
    if (user && !this.justLoggedOut) {
      // user is set, let's proceed!
      this.bypassWelcome = false;
    }
  }

  async mounted() {
    if (this.justLoggedOut) {
      this.bypassWelcome = false;
      return;
    }

    // when mounted, fill vuex store with remembered data
    mainState.setCredentialsBySource(await getRememberedCredentials());
    mainState.setRemember(await LocalForage.getItem('remember'));

    // if a remembered state allows for logging in, just do it now!
    const latestSource = await getRememberedSource();
    if (mainState.remember && latestSource) {
      const credentials: Credentials | null = mainState.getSourceCredentials(
        latestSource,
      );
      if (credentials) {
        const sourceGateway = getBySlug(latestSource);
        if (sourceGateway) {
          if (sourceGateway instanceof AuthenticatableSource) {
            await SignIn(sourceGateway, credentials);
          } else {
            mainState.setSourceGateway(sourceGateway);
          }
          trackInteractionEvent(
            'Authentication',
            'Bypassed Welcome',
            sourceGateway.slug,
          );
          this.bypassWelcome = false;
        }
      }
    } else {
      this.bypassWelcome = false;
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Anaheim&family=Quattrocento+Sans&display=swap');
body {
  @apply bg-gray-100;
}
a {
  @apply transition-colors duration-125 ease-in;
}
/* unvisited link */
a:link {
  /* @apply text-black; */
}
/* visited link */
a:visited {
  /* @apply text-black; */
}
/* mouse over link */
a:hover {
  @apply text-lead-700;
}
/* selected link */
a:active {
  @apply text-lead-600;
}

.component-fade-enter-active,
.component-fade-leave-active {
  @apply transition duration-125 ease-in;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
