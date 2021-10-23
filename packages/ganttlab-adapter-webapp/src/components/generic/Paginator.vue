<template>
  <div
    v-if="previousPage || nextPage"
    class="flex items-center justify-end text-sm"
  >
    <a v-if="currentPage > 2" href="#" class="mr-1" @click.prevent="setPage(1)">
      <Icon size="18" name="play-skip-back-circle-outline" />
    </a>
    <a
      v-if="previousPage"
      href="#"
      class="mr-5"
      @click.prevent="setPage(previousPage)"
    >
      <Icon size="18" name="caret-back-circle-outline" />
    </a>
    <div v-if="currentPage" class="cursor-default">Page {{ currentPage }}</div>
    <a v-if="nextPage" href="#" class="ml-5" @click.prevent="setPage(nextPage)">
      <Icon size="18" name="caret-forward-circle-outline" />
    </a>
    <a
      v-if="lastPage && currentPage !== lastPage && currentPage + 1 < lastPage"
      href="#"
      class="ml-1"
      @click.prevent="setPage(lastPage)"
    >
      <Icon size="18" name="play-skip-forward-circle-outline" />
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Icon from './Icon.vue';

@Component({
  components: {
    Icon,
  },
})
export default class Paginator extends Vue {
  @Prop({ type: Number, default: null }) private previousPage!: number;
  @Prop({ type: Number, default: null }) private currentPage!: number;
  @Prop({ type: Number, default: null }) private nextPage!: number;
  @Prop({ type: Number, default: null }) private lastPage!: number;

  @Emit('set-page')
  setPage(page: number) {
    return page;
  }
}
</script>
