import { Component, Vue, Emit, Prop, Watch } from 'vue-property-decorator';
import { Credentials, AuthenticatableSource } from 'ganttlab-entities';

// see https://github.com/vuejs/vue-class-component/issues/91#issuecomment-612860973

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
@Component
abstract class Login extends Vue {
  public abstract defaultCredentials: Credentials;
  public abstract getSourceGateway(): AuthenticatableSource;

  public credentials: Credentials = {};

  @Emit()
  sourceGateway() {
    return this.getSourceGateway();
  }

  @Prop() readonly value!: Credentials;

  mounted() {
    this.sourceGateway();

    // credentials are sent in Prop: use those first!
    const propSetKeys: Array<string> = [];
    for (const key in this.value) {
      if (this.value) {
        Vue.set(this.credentials, key, this.value[key]);
        propSetKeys.push(key);
      }
    }

    // complete with default credentials
    for (const key in this.defaultCredentials) {
      if (!propSetKeys.includes(key)) {
        Vue.set(this.credentials, key, this.defaultCredentials[key]);
      }
    }
  }

  @Watch('credentials', { deep: true })
  onValueChanged() {
    this.$emit('input', this.credentials);
  }
}

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
@Component
// @ts-ignore
export default class LoginMixin extends Login {}
/* eslint-enable @typescript-eslint/ban-ts-ignore */
