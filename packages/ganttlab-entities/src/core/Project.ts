/**
 * A project, which can contain tasks, milestones...
 */
export class Project {
  /**
   * @param name - The project name
   * @param path - The project path
   * @param url - The URL to this project (directly usable in an `<a>` href)
   * @param shortDescription - A human friendly, but short description like `The best project ever`
   * @param avatarUrl - The URL to this project avatar (directly usable in an img src)
   */
  constructor(
    public name: string,
    public path: string,
    public url: string,
    public shortDescription: string,
    public avatarUrl: string,
  ) {}
}
