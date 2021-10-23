import { GitLabGateway } from './GitLabGateway';
import { Credentials, Project } from 'ganttlab-entities';
import { GitLabMilestone } from './types/GitLabMilestone';

if (!process.env.EXAMPLE_GITLAB_TOKEN) {
  throw new Error('EXAMPLE_GITLAB_TOKEN environment variable is mandatory');
}

const token = process.env.EXAMPLE_GITLAB_TOKEN;

const gateway = new GitLabGateway();
const creds: Credentials = {
  instance: 'https://gitlab.com',
  token: token,
};

gateway.setCredentials(creds);

const project = new Project('GanttLab Demo', 'ganttlab/demo', '', '', '');
const encodedProjectPath = encodeURIComponent(project.path);

// a few useful dates
const populatorDate = new Date();
const fiveDaysEarlier = new Date(populatorDate);
fiveDaysEarlier.setDate(populatorDate.getDate() - 5);
const threeDaysEarlier = new Date(populatorDate);
threeDaysEarlier.setDate(populatorDate.getDate() - 3);
const twoDaysEarlier = new Date(populatorDate);
twoDaysEarlier.setDate(populatorDate.getDate() - 2);
const yesterday = new Date(populatorDate);
yesterday.setDate(populatorDate.getDate() - 1);
const tomorrow = new Date(populatorDate);
tomorrow.setDate(populatorDate.getDate() + 1);
const twoDaysAfter = new Date(populatorDate);
twoDaysAfter.setDate(populatorDate.getDate() + 2);
const threeDaysAfter = new Date(populatorDate);
threeDaysAfter.setDate(populatorDate.getDate() + 2);
const fourDaysAfter = new Date(populatorDate);
fourDaysAfter.setDate(populatorDate.getDate() + 4);
const eightDaysAfter = new Date(populatorDate);
eightDaysAfter.setDate(populatorDate.getDate() + 8);
const tenDaysAfter = new Date(populatorDate);
tenDaysAfter.setDate(populatorDate.getDate() + 10);

interface GitLabMilestoneWithId extends GitLabMilestone {
  id?: number;
}

interface GitLabIssueWithMilestoneId {
  title: string;
  created_at?: string;
  due_date?: string;
  description?: string;
  milestone_id?: number;
}

// a few useful issues
/* eslint-disable @typescript-eslint/camelcase */
const demoIssues: Array<GitLabIssueWithMilestoneId> = [
  { title: 'Just a creation date' },
  {
    title: 'With a due date 4 days after creation',
    created_at: tomorrow.toISOString(),
    due_date: threeDaysAfter.toISOString().slice(0, 10).replace(/-/g, ''),
  },
  {
    title: 'Just a creation date, but late too',
    created_at: twoDaysEarlier.toISOString(),
  },
  {
    title: 'Late with a due date',
    created_at: threeDaysEarlier.toISOString(),
    due_date: yesterday.toISOString().slice(0, 10).replace(/-/g, ''),
  },
  {
    title: 'In progress with a due date',
    created_at: yesterday.toISOString(),
    due_date: tomorrow.toISOString().slice(0, 10).replace(/-/g, ''),
  },
  {
    title: 'With a due date, but also a GanttDue',
    created_at: twoDaysEarlier.toISOString(),
    due_date: tomorrow.toISOString().slice(0, 10).replace(/-/g, ''),
    description: `GanttDue: ${threeDaysAfter.toISOString()}`,
  },
  {
    title: 'With a GanttStart and a GanttDue',
    description: `GanttStart: ${tomorrow.toISOString()}\nGanttDue: ${fourDaysAfter.toISOString()}`,
  },
];
/* eslint-enable @typescript-eslint/camelcase */

// a few useful milestones
/* eslint-disable @typescript-eslint/camelcase */
const demoMilestones: Array<GitLabMilestoneWithId> = [
  { title: 'Just a milestone', created_at: '' },
  {
    title: 'With a start date',
    created_at: '',
    start_date: twoDaysAfter.toISOString(),
  },
  {
    title: 'Start and due date',
    created_at: '',
    start_date: twoDaysEarlier.toISOString(),
    due_date: tenDaysAfter.toISOString(),
  },
  {
    title: 'Due date only',
    created_at: '',
    due_date: eightDaysAfter.toISOString(),
  },
];
/* eslint-enable @typescript-eslint/camelcase */

async function removeAllIssues(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await gateway.safeAxiosRequest<Array<any>>({
    method: 'GET',
    url: `/projects/${encodedProjectPath}/issues`,
  });

  for (const gitlabIssue of data) {
    await gateway.safeAxiosRequest({
      method: 'DELETE',
      url: `/projects/${encodedProjectPath}/issues/${gitlabIssue.iid}`,
    });
  }
}

async function removeAllMilestones(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await gateway.safeAxiosRequest<Array<any>>({
    method: 'GET',
    url: `/projects/${encodedProjectPath}/milestones`,
  });

  for (const gitlabMilestone of data) {
    await gateway.safeAxiosRequest({
      method: 'DELETE',
      url: `/projects/${encodedProjectPath}/milestones/${gitlabMilestone.id}`,
    });
  }
}

async function createMilestones(): Promise<void> {
  for (const aDemoMilestone of demoMilestones) {
    const { data } = await gateway.safeAxiosRequest<GitLabMilestoneWithId>({
      method: 'POST',
      url: `/projects/${encodedProjectPath}/milestones`,
      data: aDemoMilestone,
    });
    aDemoMilestone.id = data.id;
  }
}

function createIssues(): void {
  /* eslint-disable @typescript-eslint/camelcase */
  demoIssues.push(
    {
      title: 'Simple issue in a milestone with due',
      milestone_id: demoMilestones[3].id,
    },
    {
      title: 'With GanttStart in a milestone with due',
      description: `GanttStart: ${tomorrow.toISOString()}`,
      milestone_id: demoMilestones[3].id,
    },
    {
      title: 'GanttStart&Due in a milestone with due',
      description: `GanttStart: ${yesterday.toISOString()}\nGanttDue: ${twoDaysAfter.toISOString()}`,
      milestone_id: demoMilestones[3].id,
    },
    {
      title: 'Late in a milestone',
      description: `GanttStart: ${fiveDaysEarlier.toISOString()}\nGanttDue: ${yesterday.toISOString()}`,
      milestone_id: demoMilestones[3].id,
    },
    {
      title: 'Created long ago in a milestone with start',
      created_at: fiveDaysEarlier.toISOString(),
      milestone_id: demoMilestones[1].id,
    },
  );
  /* eslint-enable @typescript-eslint/camelcase */
  demoIssues.forEach((data) => {
    gateway.safeAxiosRequest({
      method: 'POST',
      url: `/projects/${encodedProjectPath}/issues`,
      data,
    });
  });
}

async function doIt(): Promise<void> {
  await removeAllIssues();
  await removeAllMilestones();
  await createMilestones();
  createIssues();
}

doIt();
