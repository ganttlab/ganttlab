import {
  ViewSourceStrategy,
  Configuration,
  PaginatedListOfTasks,
  Task,
  Project,
} from 'ganttlab-entities';
import { GitLabGateway } from '../../../sources/gitlab/GitLabGateway';
import { GitLabIssue } from '../../../sources/gitlab/types/GitLabIssue';
import {
  getTaskFromGitLabIssue,
  getPaginationFromGitLabHeaders,
} from '../../../sources/gitlab/helpers';

export class ViewProjectGitLabStrategy
  implements ViewSourceStrategy<PaginatedListOfTasks> {
  async execute(
    source: GitLabGateway,
    configuration: Configuration,
  ): Promise<PaginatedListOfTasks> {
    const encodedProject = encodeURIComponent(
      (configuration.project as Project).path as string,
    );
    const { data, headers } = await source.safeAxiosRequest<Array<GitLabIssue>>(
      {
        method: 'GET',
        url: `/projects/${encodedProject}/issues`,
        params: {
          page: configuration.tasks.page,
          // eslint-disable-next-line @typescript-eslint/camelcase
          per_page: configuration.tasks.pageSize,
          state: 'opened',
        },
      },
    );
    const tasksList: Array<Task> = [];
    for (let index = 0; index < data.length; index++) {
      const gitlabIssue = data[index];
      const task = getTaskFromGitLabIssue(gitlabIssue);
      tasksList.push(task);
    }
    const byDueTasksList = tasksList.sort((a: Task, b: Task) => {
      if (a.due && b.due) {
        return a.due.getTime() - b.due.getTime();
      }
      return 0;
    });
    const gitlabPagination = getPaginationFromGitLabHeaders(headers);
    return new PaginatedListOfTasks(
      byDueTasksList,
      configuration.tasks.page as number,
      configuration.tasks.pageSize as number,
      gitlabPagination.previousPage,
      gitlabPagination.nextPage,
      gitlabPagination.lastPage,
      gitlabPagination.total,
    );
  }
}
