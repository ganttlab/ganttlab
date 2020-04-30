import { PaginatedListOfTasks } from '../pagination/PaginatedListOfTasks';

/**
 * A way to group {@link Task}s
 */
export class Milestone {
  /**
   * The paginated list of {@link Task}s in the milestone
   */
  public tasks: PaginatedListOfTasks | null = null;

  /**
   * @param name - The milestone name
   * @param url - The URL to this milestone (directly usable in an `<a>` href)
   * @param description - The milestone description
   * @param start - A start date for the milestone
   * @param due - A due date for the milestone
   */
  constructor(
    public name: string,
    public url?: string,
    public description?: string,
    public start?: Date,
    public due?: Date,
  ) {}
}
