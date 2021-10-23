<template>
  <div>
    <div class="absolute right-0 mt-2 mr-2 text-lead-600">
      <Typer v-if="typing && !loading" size="24" />
      <Spinner v-if="loading && !typing" size="24" />
    </div>
    <GenericInput
      ref="inputComponent"
      :type="type"
      :disabled="loading"
      v-model="syncedSearch"
      @input="onInput"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
    >
      <slot name="label" slot="label"></slot>
    </GenericInput>
    <div class="relative">
      <ul
        v-if="results !== null"
        ref="result-list"
        class="absolute w-full -mt-6 h-64 overflow-y-auto bg-lead-100 rounded shadow-md"
      >
        <li v-if="results.length === 0" class="px-4 py-8 text-center">
          <slot name="no-result" :searched="syncedSearch"></slot>
        </li>
        <li
          v-for="(result, i) in results"
          :key="i"
          :ref="`result-${i}`"
          :id="`result-${i}`"
          :class="{ 'is-active': i === selectedResultIndex }"
          class="a-result cursor-pointer px-4 py-2"
          @click="selectResult(result)"
        >
          <slot name="result" :result="result"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import GenericInput from './Input.vue';
import GenericButton from './Button.vue';
import Typer from '../Typer.vue';
import Spinner from '../Spinner.vue';
import { debounce } from 'lodash';

@Component({
  components: {
    GenericInput,
    GenericButton,
    Typer,
    Spinner,
  },
})
export default class Autocomplete extends Vue {
  public syncedSearch = '';
  public typing = false;
  public selectedResultIndex = -1;

  @Prop({ type: String, default: '' }) readonly search!: string;
  @Prop({ type: String, default: 'text' }) private type!: string;
  @Prop({ type: Boolean, default: false }) private loading!: boolean;
  @Prop({ default: null }) private results!: Array<unknown> | null;
  @Prop({ default: false }) private focus!: boolean;

  focusInput() {
    ((this.$refs.inputComponent as Vue).$refs
      .inputEl as HTMLInputElement).focus();
  }

  mounted() {
    this.$nextTick(() => {
      this.syncedSearch = this.search;
      if (this.focus) {
        this.focusInput();
      }
    });
  }

  @Watch('results')
  onResultsChanged() {
    this.$nextTick(() => {
      this.focusInput();
    });
  }

  @Watch('search')
  onValueChanged() {
    this.syncedSearch = this.search;
  }

  created() {
    this.onSearchChanged = debounce(this.onSearchChanged, 750);
  }

  onInput(newValue: string) {
    this.typing = true;
    this.onSearchChanged(newValue);
  }

  @Emit('search')
  onSearchChanged(newValue: string) {
    this.typing = false;
    return newValue; // actually emits
  }

  @Emit('select-result')
  selectResult(result: unknown) {
    return result;
  }

  get targetLi(): HTMLElement {
    return this.$refs[`result-${this.selectedResultIndex}`] as Array<
      HTMLElement
    >[0];
  }

  onArrowDown() {
    if (this.results && this.selectedResultIndex < this.results.length - 1) {
      this.selectedResultIndex = this.selectedResultIndex + 1;
      this.targetLi.scrollIntoView(false);
    }
  }
  onArrowUp() {
    if (this.selectedResultIndex > 0) {
      this.selectedResultIndex = this.selectedResultIndex - 1;
      this.targetLi.scrollIntoView(true);
    }
  }
  onEnter() {
    if (this.results) {
      this.selectResult(this.results[this.selectedResultIndex]);
    }
  }
}
</script>

<style lang="scss" scoped>
.a-result:hover,
.a-result.is-active {
  @apply bg-lead-600 text-lead-100;
}
</style>
