export class GitLabProject {
  constructor(
    public name: string,
    public path_with_namespace: string,
    public web_url: string,
    public description: string,
    public avatar_url: string,
  ) {}
}
