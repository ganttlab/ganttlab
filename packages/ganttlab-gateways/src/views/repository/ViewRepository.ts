import {
  SourceVisitor,
  PaginatedListOfTasks,
  Configuration,
  Project,
  Sort,
  Filter,
} from 'ganttlab-entities';
import { ViewRepositoryGitHubStrategy } from './strategies/ViewRepositoryGitHubStrategy';

export class ViewRepository extends SourceVisitor<PaginatedListOfTasks> {
  public slug = 'repository';
  public name = 'By repository';
  public shortDescription = 'Issues within a repository';
  public slugStrategies = {
    github: new ViewRepositoryGitHubStrategy(),
  };

  public configuration: Configuration = {
    project: null as Project | null,
    tasks: {
      page: 1,
      pageSize: 50,
    },
  };

  setSort(sort: Sort): void {
    throw new Error('Method not implemented.');
  }
  reverseSort(): void {
    throw new Error('Method not implemented.');
  }
  setFilter(filter: Filter): void {
    throw new Error('Method not implemented.');
  }
}
