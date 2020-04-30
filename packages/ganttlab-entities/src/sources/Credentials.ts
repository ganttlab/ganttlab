/**
 * Implemented by objects used as credentials for a {@link Source}
 */
export interface Credentials {
  /**
   * An arbitrary set of key/value pairs used as {@link Source} credentials
   */
  [key: string]: string;
}
