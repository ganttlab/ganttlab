import * as crypto from 'crypto';

/**
 * A user, who can be the creator of a {@link Task}, or assigned to it for example
 */
export class User {
  /**
   * The URL to this user avatar (directly usable in an img src)
   */
  public avatarUrl: string;

  /**
   * @param email - This user email
   * @param username - A username (or login) for this user
   * @param url - The URL to this user (directly usable in an `<a>` href)
   * @param _avatarUrl - An URL directly usable in an img src
   */
  constructor(
    public email: string,
    public username: string,
    public url: string | null = null,
    _avatarUrl?: string,
  ) {
    if (!_avatarUrl) {
      const usedEmail = email ? email : '';
      const emailHash = crypto
        .createHash('md5')
        .update(usedEmail.trim().toLowerCase())
        .digest('hex');
      this.avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=200&d=mp`;
    } else {
      this.avatarUrl = _avatarUrl;
    }
  }
}
