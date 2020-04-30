import {
  SourceVisitor,
  PaginatedListOfTasks,
  Configuration,
  Sort,
  Filter,
} from 'ganttlab-entities';
import { ViewMineGitHubStrategy } from './strategies/ViewMineGitHubStrategy';
import { ViewMineGitLabStrategy } from './strategies/ViewMineGitLabStrategy';

export class ViewMine extends SourceVisitor<PaginatedListOfTasks> {
  public slug = 'mine';
  public name = 'Created by me';
  public shortDescription = 'All of the issues you did create';
  public slugStrategies = {
    github: new ViewMineGitHubStrategy(),
    gitlab: new ViewMineGitLabStrategy(),
  };

  public configuration: Configuration = {
    username: '',
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
