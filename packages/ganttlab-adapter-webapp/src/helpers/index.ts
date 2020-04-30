import { getModule } from 'vuex-module-decorators';
import MainModule from '../store/modules/MainModule';
import { DisplayableError } from './DisplayableError';

const mainState = getModule(MainModule);

export function hashCode(value: string) {
  let hash = 0,
    i,
    chr;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function addDisplaybleError(error: DisplayableError) {
  mainState.addError(error);
}
