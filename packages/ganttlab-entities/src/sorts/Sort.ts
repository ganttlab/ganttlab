/**
 * Implemented by objects providing a specific sort
 */
export interface Sort {
  /**
   * A lowercase, dash instead of punctuation [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) like `by-due-date`
   */
  slug: string;

  /**
   * A proper, human friendly name like `By due date`
   */
  name: string;

  /**
   * A human friendly, but short description like `Only tasks you're assigned to`
   */
  shortDescription: string;
}
