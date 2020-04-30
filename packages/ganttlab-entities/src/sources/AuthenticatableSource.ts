import { Credentials } from './Credentials';
import { User } from '../core/User';
import { Source } from './Source';

/**
 * Extended by {@link Source} objects which needs {@link Credentials} to authenticate
 */
export abstract class AuthenticatableSource extends Source {
  /**
   * Automatically adding that here to simplify operations down the road
   */
  public isAuthenticatable = true;

  /**
   * The actual credentials
   *
   * @remarks
   * By default, even if the {@link Source} is Authenticatable, there can be no credentials
   */
  public credentials: Credentials | null = null;

  /**
   * (Re)Define this {@link Source} credentials
   * @param credentials
   */
  public abstract setCredentials(credentials: Credentials): void;

  /**
   * Retrieve the URL to this {@link Source} (directly usable in an `<a>` href)
   */
  public abstract getUrl(): string | null;

  /**
   * Retreive this {@link Source} logged-in {@link User}
   */
  public abstract getLoggedInUser(): Promise<User>;
}
