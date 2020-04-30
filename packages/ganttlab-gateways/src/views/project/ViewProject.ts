import {
  SourceVisitor,
  PaginatedListOfTasks,
  Configuration,
  Project,
  Sort,
  Filter,
} from 'ganttlab-entities';
import { ViewProjectGitLabStrategy } from './strategies/ViewProjectGitLabStrategy';

export class ViewProject extends SourceVisitor<PaginatedListOfTasks> {
  public slug = 'project';
  public name = 'By project';
  public shortDescription = 'Issues within a project';
  public slugStrategies = {
    gitlab: new ViewProjectGitLabStrategy(),
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
