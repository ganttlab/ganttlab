import { GitHubGateway } from '../../../sources/github/GitHubGateway';
import {
  ViewSourceStrategy,
  PaginatedListOfMilestones,
  Milestone,
  Configuration,
  Task,
  Project,
  PaginatedListOfTasks,
} from 'ganttlab-entities';
import {
  getTaskFromGitHubIssue,
  getPaginationFromGitHubHeaders,
  getMilestoneFromGitHubMilestone,
} from '../../../sources/github/helpers';
import { GitHubMilestone } from '../../../sources/github/types/GitHubMilestone';
import { GitHubIssue } from '../../../sources/github/types/GitHubIssue';
import { TasksAndMilestones } from 'ganttlab-use-cases';

export class ViewMilestoneGitHubStrategy
  implements ViewSourceStrategy<TasksAndMilestones> {
  async execute(
    source: GitHubGateway,
    configuration: Configuration,
  ): Promise<TasksAndMilestones> {
    const { data, headers } = await source.safeAxiosRequest<
      Array<GitHubMilestone>
    >({
      method: 'GET',
      url: `/repos/${(configuration.project as Project).path}/milestones`,
      params: {
        page: configuration.milestones.page,
        // eslint-disable-next-line @typescript-eslint/camelcase
        per_page: configuration.milestones.pageSize,
        state: 'open',
        sort: 'due_on',
        direction: 'asc',
      },
    });

    const milestonesList: Array<Milestone> = [];
    let tasksForActiveMilestone: PaginatedListOfTasks | null = null;
    for (
      let milestoneIndex = 0;
      milestoneIndex < data.length;
      milestoneIndex++
    ) {
      const githubMilestone = data[milestoneIndex];
      const milestone = getMilestoneFromGitHubMilestone(githubMilestone);

      // loading tasks for the active milestone
      if (milestoneIndex === configuration.activeMilestone) {
        const result = await source.safeAxiosRequest<{
          items: Array<GitHubIssue>;
        }>({
          method: 'GET',
          url: '/search/issues',
          params: {
            page: configuration.tasks.page,
            // eslint-disable-next-line @typescript-eslint/camelcase
            per_page: configuration.tasks.pageSize,
            q: `state:open repo:${
              (configuration.project as Project).path
            } milestone:"${milestone.name}"`,
          },
        });

        const tasksList: Array<Task> = [];
        for (
          let issueIndex = 0;
          issueIndex < result.data.items.length;
          issueIndex++
        ) {
          const githubIssue = result.data.items[issueIndex];
          const task = getTaskFromGitHubIssue(githubIssue);
          tasksList.push(task);
        }
        const byDueTasksList = tasksList.sort((a: Task, b: Task) => {
          if (a.due && b.due) {
            return a.due.getTime() - b.due.getTime();
          }
          return 0;
        });
        const githubPagination = getPaginationFromGitHubHeaders(result.headers);
        tasksForActiveMilestone = new PaginatedListOfTasks(
          byDueTasksList,
          configuration.tasks.page as number,
          configuration.tasks.pageSize as number,
          githubPagination.previousPage,
          githubPagination.nextPage,
          githubPagination.lastPage,
        );
      }

      milestonesList.push(milestone);
    }

    const githubPagination = getPaginationFromGitHubHeaders(headers);

    return new TasksAndMilestones(
      new PaginatedListOfMilestones(
        milestonesList,
        configuration.milestones.page as number,
        configuration.milestones.pageSize as number,
        githubPagination.previousPage,
        githubPagination.nextPage,
        githubPagination.lastPage,
      ),
      tasksForActiveMilestone,
    );
  }
}
