<template>
  <div>
    <transition name="component-fade" mode="out-in">
      <Modal v-if="showModal" @close="closeModal()">
        <template v-slot:header>
          <p class="font-lead text-2xl">Choose another view</p>
        </template>

        <transition name="component-fade" mode="out-in">
          <div v-if="!selectedViewToConfigure" class="p-4">
            <div class="flex flex-wrap justify-start">
              <div
                v-for="(view, key) in views"
                :key="key"
                class="cursor-pointer flex-none flex px-4 py-2 m-2 rounded-md text-white bg-lead-600 hover:bg-lead-500 shadow transition duration-125 ease-in"
                @click="selectNewView(view)"
              >
                <div
                  class="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-lead-200 text-lead-600"
                >
                  <Icon size="32" :name="view.icon" />
                </div>
                <div class="w-56">
                  <p class="text-lg">{{ view.instance.name }}</p>
                  <p class="text-sm text-lead-200">
                    {{ view.instance.shortDescription }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex">
              <div class="flex-none w-64 bg-gray-100 px-4 py-8">
                <div class="flex items-center">
                  <Icon size="18" :name="selectedViewToConfigure.icon" />
                  <p class="ml-2 text-lg leading-none">
                    {{ selectedViewToConfigure.instance.name }}
                  </p>
                </div>
                <p class="mt-1 text-sm text-gray-600">
                  {{ selectedViewToConfigure.instance.shortDescription }}
                </p>
              </div>
              <div class="flex-grow p-8">
                <component
                  :is="configurator"
                  :sourceGateway="sourceGateway"
                  @set-configuration="setConfiguration($event)"
                />
              </div>
            </div>
          </div>
        </transition>
      </Modal>
      <div
        v-else
        class="flex items-center cursor-pointer text-lead-100 px-2 rounded border border-lead-600 hover:border-lead-500 transition duration-125 ease-in"
        @click="pickANewView"
      >
        <p class="flex-grow text-lg">
          <span v-if="viewGateway">{{ viewGateway.name }}</span>
          <span v-else>...</span>
        </p>
        <div class="text-lead-500">
          <Icon size="18" name="search-outline" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Icon from '../../generic/Icon.vue';
import Modal from '../../generic/Modal.vue';
import { getModule } from 'vuex-module-decorators';
import MainModule from '../../../store/modules/MainModule';
import { Source, Configuration, View } from 'ganttlab-entities';
import {
  ImplementedViewsGateways,
  ViewGateway,
} from '../../../helpers/ImplementedViewsGateways';
import { DisplayableError } from '../../../helpers/DisplayableError';
import { addDisplaybleError } from '../../../helpers';
import { getRememberedViewsBySource } from '../../../helpers/LocalForage';
import { trackInteractionEvent } from '../../../helpers/GTM';

const mainState = getModule(MainModule);

@Component({
  components: {
    Icon,
    Modal,
  },
})
export default class ViewSelector extends Vue {
  public showModal = false;
  public views: Array<ViewGateway> = [];
  public selectedViewToConfigure: ViewGateway | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public configurator: any | null = null;

  @Prop({ required: true }) readonly sourceGateway!: Source;

  // view gateway is stored in vuex store
  get viewGateway(): View | null {
    if (mainState.viewGateway) {
      return mainState.viewGateway;
    }
    return null;
  }

  pickANewView() {
    this.showModal = true;
    trackInteractionEvent('Click', 'Pick a new view');
  }

  async selectNewView(newView: ViewGateway) {
    // let's see if the newly selected view has a configurator
    import(`./configurators/${newView.slug}.vue`)
      .then(() => {
        // display the newView configurator
        this.configurator = () => import(`./configurators/${newView.slug}.vue`);
        this.selectedViewToConfigure = newView;
        trackInteractionEvent(
          'View',
          'Selected (with configuration)',
          newView.slug,
        );
      })
      .catch(() => {
        if (this.viewGateway && newView.slug === this.viewGateway.slug) {
          // no configurator at all, and same view selected: just close the modal and nothing more
          this.closeModal();
          trackInteractionEvent('View', 'Selected same', newView.slug);
          return;
        }
        // another selected view without a configurator, just set it
        this.setView(newView, newView.defaultConfiguration);
        trackInteractionEvent(
          'View',
          'Selected (no configuration)',
          newView.slug,
        );
      });
  }

  closeModal() {
    this.showModal = false;
    this.selectedViewToConfigure = null;
    this.configurator = null;
  }

  setConfiguration(configuration: Configuration) {
    if (this.selectedViewToConfigure) {
      trackInteractionEvent(
        'View',
        'Configured',
        this.selectedViewToConfigure.slug,
      );
      this.setView(this.selectedViewToConfigure, configuration);
    }
  }

  @Emit('set-view')
  async setView(view: ViewGateway, configuration: Configuration) {
    // configure the view
    view.instance.setConfiguration(configuration);
    // store it in vuex
    mainState.setViewGateway(view.instance);
    // close the modal and emit the view
    this.closeModal();
    return view.instance;
  }

  async mounted() {
    const allViews = ImplementedViewsGateways;
    // ensure to put username on "mine" view
    allViews[0].defaultConfiguration.username = mainState.user?.username;

    this.views = allViews.filter((view: ViewGateway) => {
      return view.instance
        .supportedSourcesSlugs()
        .includes(this.sourceGateway.slug);
    });

    if (!this.views.length) {
      addDisplaybleError(
        new DisplayableError(
          `There is no view supporting the '${this.sourceGateway.slug}' source`,
          'Unable to list views',
        ),
      );

      return;
    }

    // if a remembered state allows for pre-setting a view, just do it now!
    const latestView = await getRememberedViewsBySource(
      this.sourceGateway.slug,
    );
    let viewGateway: ViewGateway | undefined;
    if (latestView) {
      viewGateway = allViews.find(
        (view: ViewGateway) => view.slug === latestView.slug,
      );
    }
    if (mainState.remember && latestView && viewGateway) {
      this.setView(viewGateway, latestView.configuration);
      trackInteractionEvent('View', 'Preset', viewGateway.slug);
    } else {
      // by default, simply use the first implemented view
      this.setView(this.views[0], this.views[0].defaultConfiguration);
      trackInteractionEvent('View', 'Default', this.views[0].slug);
    }
  }
}
</script>
