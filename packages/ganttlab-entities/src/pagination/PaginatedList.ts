/**
 * A generic, paginated list of things
 *
 * @typeParam T - The generic type of things actually paginated
 */
export class PaginatedList<T> {
  /**
   * @param list - The list of things
   * @param page - The current page of the things in the list
   * @param pageSize - This page size (answers "how many things are there per page?")
   * @param previousPage - The previous page of things (if any)
   * @param nextPage - The next page of things (if any)
   * @param lastPage - The last page of things (if known)
   * @param total - The total of things in the unpaginated list (when known)
   */
  constructor(
    public list: Array<T>,
    public page: number,
    public pageSize: number,
    public previousPage?: number,
    public nextPage?: number,
    public lastPage?: number,
    public total?: number,
  ) {}
}
