import {
  PaginatedListOfTasks,
  PaginatedListOfMilestones,
} from 'ganttlab-entities';

interface GanttLabStringConfiguration {
  ganttStartString: string;
  ganttDueString: string;
}

export interface TaskDetails {
  startDate: Date | null;
  dueDate: Date | null;
}

export function markdownToTaskDetails(
  markdown: string,
  ganttStringConfig: GanttLabStringConfiguration,
): TaskDetails {
  let startDate: Date | null = null;
  let dueDate: Date | null = null;
  // reading lines from this task body to search for ganttStartString and ganttDueString
  if (markdown != null) {
    const lines = markdown.split('\n');
    for (let j = 0; j < lines.length; j++) {
      // this task body line starts with the ganttStartString
      if (!lines[j].indexOf(ganttStringConfig.ganttStartString)) {
        const theDate = new Date(
          lines[j].replace(ganttStringConfig.ganttStartString, '').trim(),
        );
        if (theDate instanceof Date && !isNaN((theDate as unknown) as number)) {
          startDate = theDate;
        }
      }

      // this task body line starts with the ganttDueString
      if (!lines[j].indexOf(ganttStringConfig.ganttDueString)) {
        const theDate = new Date(
          lines[j].replace(ganttStringConfig.ganttDueString, '').trim(),
        );
        if (theDate instanceof Date && !isNaN((theDate as unknown) as number)) {
          dueDate = theDate;
        }
      }
    }
  }

  return { startDate, dueDate };
}

export class TasksAndMilestones {
  constructor(
    public milestones: PaginatedListOfMilestones,
    public tasks: PaginatedListOfTasks | null = null,
  ) {}
}
