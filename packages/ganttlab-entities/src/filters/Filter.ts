/**
 * Implemented by objects providing a specific filter
 */
export interface Filter {
  /**
   * A lowercase, dash instead of punctuation [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) like `assigned-to-me`
   */
  slug: string;

  /**
   * A proper, human friendly name like `Assigned to me`
   */
  name: string;

  /**
   * A human friendly, but short description like `Only tasks you're assigned to`
   */
  shortDescription: string;
}
