import { issueDescriptionToTaskDetails } from '../abstracts/helpers';
import { Task, Milestone } from 'ganttlab-entities';
import { GitHubIssue } from './types/GitHubIssue';
import { AxiosHeaders } from '../abstracts/AxiosHeaders';
import parseLinkHeader from 'parse-link-header';
import { GitHubMilestone } from './types/GitHubMilestone';

export function getTaskFromGitHubIssue(githubIssue: GitHubIssue): Task {
  const { startDate, dueDate } = issueDescriptionToTaskDetails(
    githubIssue.body,
  );
  return new Task(
    githubIssue.title,
    githubIssue.html_url,
    startDate ? startDate : new Date(githubIssue.created_at),
    dueDate ? dueDate : undefined,
  );
}

export function getPaginationFromGitHubHeaders(
  headers: AxiosHeaders,
): {
  previousPage: number | undefined;
  nextPage: number | undefined;
  lastPage: number | undefined;
  total: number | undefined;
} {
  const linkHeader = parseLinkHeader(headers['link']);
  return {
    previousPage:
      linkHeader && linkHeader.prev && linkHeader.prev.page
        ? parseInt(linkHeader.prev.page)
        : undefined,
    nextPage:
      linkHeader && linkHeader.next && linkHeader.next.page
        ? parseInt(linkHeader.next.page)
        : undefined,
    lastPage:
      linkHeader && linkHeader.last && linkHeader.last.page
        ? parseInt(linkHeader.last.page)
        : undefined,
    total: undefined,
  };
}

export function getMilestoneFromGitHubMilestone(
  githubMilestone: GitHubMilestone,
): Milestone {
  return new Milestone(
    githubMilestone.title,
    githubMilestone.html_url,
    githubMilestone.description,
    undefined,
    githubMilestone.due_on ? new Date(githubMilestone.due_on) : undefined,
  );
}
