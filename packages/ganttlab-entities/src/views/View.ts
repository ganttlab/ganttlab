import { Sort } from '../sorts/Sort';
import { Filter } from '../filters/Filter';
import { Configuration } from './Configuration';

/**
 * Implemented by objects providing a specific view
 */
export abstract class View {
  /**
   * A lowercase, dash instead of punctuation [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) like `mine`
   */
  public abstract slug: string;

  /**
   * A proper, human friendly name like `Created by me`
   */
  public abstract name: string;

  /**
   * A human friendly, but short description like `All of your tasks`
   */
  public abstract shortDescription: string;

  /**
   * This {@link View} configuration
   *
   * @remarks
   * The implementer is forced - on purpose - to set a default configuration with the appropriate type
   */
  public abstract configuration: Configuration;

  /**
   * (Re)Define this {@link View} configuration
   * @param configuration
   */
  public setConfiguration(configuration: Configuration): void {
    this.configuration = configuration;
  }

  /**
   * This {@link View} sort
   *
   * @remarks
   * By default, even if this {@link View} is sortable, there can be no sort
   */
  public sort: Sort | null = null;

  /**
   * (Re)Define this{@link View} sort
   * @param sort
   */
  public abstract setSort(sort: Sort): void;

  /**
   * Provide a mechanism to reverse this {@link View} sort
   */
  public abstract reverseSort(): void;

  /**
   * This {@link View} filter
   *
   * @remarks
   * By default, even if this {@link View} is filterable, there can be no filter
   */
  public filter: Filter | null = null;

  /**
   * (Re)Define this {@link View} filter
   * @param filter
   */
  public abstract setFilter(filter: Filter): void;
}
