import {
  SourceVisitor,
  Configuration,
  Project,
  Sort,
  Filter,
} from 'ganttlab-entities';
import { TasksAndMilestones } from 'ganttlab-use-cases';
import { ViewMilestoneGitHubStrategy } from './strategies/ViewMilestoneGitHubStrategy';
import { ViewMilestoneGitLabStrategy } from './strategies/ViewMilestoneGitLabStragety';

export class ViewMilestone extends SourceVisitor<TasksAndMilestones> {
  public slug = 'milestone';
  public name = 'By milestone';
  public shortDescription = 'Issues in project/repo milestones';
  public slugStrategies = {
    github: new ViewMilestoneGitHubStrategy(),
    gitlab: new ViewMilestoneGitLabStrategy(),
  };

  public configuration: Configuration = {
    project: null as Project | null,
    activeMilestone: 0,
    tasks: {
      page: 1,
      pageSize: 50,
    },
    milestones: {
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
