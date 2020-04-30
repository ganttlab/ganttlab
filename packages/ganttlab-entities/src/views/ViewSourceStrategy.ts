import { Source } from '../sources/Source';
import { Configuration } from './Configuration';

/**
 * Implemented by objects providing a strategy to {@link View}s
 *
 * @typeParam T - The generic type expected back when executing the strategy
 *
 * @remarks Using the "Strategy" design pattern to be interchangeable within a {@link View}.
 */
export interface ViewSourceStrategy<T> {
  /**
   * The "execute" method of the "Strategy" design pattern
   *
   * @param source - The visited {@link Source}
   * @param configuration - The {@link Configuration} to use for the {@link View}
   */
  execute(source: Source, configuration: Configuration): Promise<T>;
}
