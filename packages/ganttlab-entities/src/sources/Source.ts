import { SourceVisitor } from '../views/SourceVisitor';

/**
 * Implemented by objects providing a specific source
 */
export abstract class Source {
  /**
   * A lowercase, dash instead of punctuation [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) like `gitlab` or `github`
   */
  public abstract slug: string;

  /**
   * A proper, human friendly name like `GitLab`
   */
  public abstract name: string;

  /**
   *
   * @param visitor - A SourceVisitor
   */
  public getDataFor<T>(
    visitor: SourceVisitor<T>,
  ): ReturnType<typeof visitor.getDataFrom> {
    if (!visitor.supportedSourcesSlugs().includes(this.slug)) {
      throw new Error(
        `The '${visitor.name}' view does not support '${this.name}' as a source`,
      );
    }
    return visitor.getDataFrom(this);
  }
}
