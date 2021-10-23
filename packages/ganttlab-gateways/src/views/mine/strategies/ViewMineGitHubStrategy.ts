import { GitHubGateway } from '../../../sources/github/GitHubGateway';
import {
  ViewSourceStrategy,
  Configuration,
  PaginatedListOfTasks,
  Task,
} from 'ganttlab-entities';
import { GitHubIssue } from '../../../sources/github/types/GitHubIssue';
import {
  getTaskFromGitHubIssue,
  getPaginationFromGitHubHeaders,
} from '../../../sources/github/helpers';

export class ViewMineGitHubStrategy
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
        q: `author:${configuration.username} is:open sort:created`,
      },
    });
    const tasksList: Array<Task> = [];
    for (const githubIssue of data.items) {
      const task = getTaskFromGitHubIssue(githubIssue);
      tasksList.push(task);
    }
    tasksList.sort((a: Task, b: Task) => {
      if (a.due && b.due) {
        return a.due.getTime() - b.due.getTime();
      }
      return 0;
    });
    const githubPagination = getPaginationFromGitHubHeaders(headers);
    return new PaginatedListOfTasks(
      tasksList,
      configuration.tasks.page as number,
      configuration.tasks.pageSize as number,
      githubPagination.previousPage,
      githubPagination.nextPage,
      githubPagination.lastPage,
    );
  }
}
