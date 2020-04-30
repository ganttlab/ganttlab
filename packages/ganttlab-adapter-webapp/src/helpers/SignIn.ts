import { AuthenticatableSource, Credentials } from 'ganttlab-entities';
import { getModule } from 'vuex-module-decorators';
import MainModule from '../store/modules/MainModule';
import { DisplayableError } from './DisplayableError';

const mainState = getModule(MainModule);

export async function SignIn(
  source: AuthenticatableSource,
  credentials: Credentials,
): Promise<boolean> {
  source.setCredentials(credentials);
  try {
    const user = await source.getLoggedInUser();
    mainState.setSourceGateway(source);
    mainState.setUser(user);
    return true;
  } catch (error) {
    mainState.addError(
      new DisplayableError(error, `${source.name} initialization error`),
    );
    return false;
  }
}
