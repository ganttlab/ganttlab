<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 512 512"
    :aria-labelledby="name"
    role="presentation"
    class="fill-current inline-block align-middle"
  >
    <title lang="en">{{ name.replace(/-/g, ' ') }} icon</title>
    <component :is="injectedComponent" />
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Icon extends Vue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public injectedComponent: any = null;
  private defaultUnexistingIcon = 'warning';

  @Prop(String) private name!: string;
  @Prop({ type: [Number, String], default: 16 }) private size!: number | string;

  mounted() {
    if (this.name) {
      import(`./icons/${this.name}`)
        .then(() => {
          this.injectedComponent = () => import(`./icons/${this.name}`);
        })
        .catch(() => {
          this.injectedComponent = () =>
            import(`./icons/${this.defaultUnexistingIcon}`);
          throw new Error(`No icon with name '${this.name}'`);
        });
    }
  }
}
</script>
