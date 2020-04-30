import { TaskDetails, markdownToTaskDetails } from 'ganttlab-use-cases';

const ganttStartString = process.env.VUE_APP_GANTT_START_STRING
  ? process.env.VUE_APP_GANTT_START_STRING
  : 'GanttStart:';
const ganttDueString = process.env.VUE_APP_GANTT_DUE_STRING
  ? process.env.VUE_APP_GANTT_DUE_STRING
  : 'GanttDue:';

export function issueDescriptionToTaskDetails(
  description: string,
): TaskDetails {
  return markdownToTaskDetails(description, {
    ganttStartString,
    ganttDueString,
  });
}
