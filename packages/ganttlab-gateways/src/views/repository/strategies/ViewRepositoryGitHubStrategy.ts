import { GitHubGateway } from '../../../sources/github/GitHubGateway';
import {
  ViewSourceStrategy,
  Configuration,
  PaginatedListOfTasks,
  Task,
  Project,
} from 'ganttlab-entities';
import { GitHubIssue } from '../../../sources/github/types/GitHubIssue';
import {
  getTaskFromGitHubIssue,
  getPaginationFromGitHubHeaders,
} from '../../../sources/github/helpers';

export class ViewRepositoryGitHubStrategy
  implements ViewSourceStrategy<PaginatedListOfTasks> {
  async execute(
    source: GitHubGateway,
    configuration: Configuration,
  ): Promise<PaginatedListOfTasks> {
    const { data, headers } = await source.safeAxiosRequest<{
      items: Array<GitHubIssue>;
    }>({
      method: 'GET',
      url: '/search/issues',
      params: {
        page: configuration.tasks.page,
        // eslint-disable-next-line @typescript-eslint/camelcase
        per_page: configuration.tasks.pageSize,
        q: `state:open type:issue repo:${
          (configuration.project as Project).path
        }`,
      },
    });
    const tasksList: Array<Task> = [];
    for (let index = 0; index < data.items.length; index++) {
      const githubIssue = data.items[index];
      const task = getTaskFromGitHubIssue(githubIssue);
      tasksList.push(task);
    }
    const byDueTasksList = tasksList.sort((a: Task, b: Task) => {
      if (a.due && b.due) {
        return a.due.getTime() - b.due.getTime();
      }
      return 0;
    });
    const githubPagination = getPaginationFromGitHubHeaders(headers);
    return new PaginatedListOfTasks(
      byDueTasksList,
      configuration.tasks.page as number,
      configuration.tasks.pageSize as number,
      githubPagination.previousPage,
      githubPagination.nextPage,
      githubPagination.lastPage,
    );
  }
}
