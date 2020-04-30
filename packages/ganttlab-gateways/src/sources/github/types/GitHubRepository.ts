export class GitHubRepository {
  constructor(
    public name: string,
    public full_name: string,
    public html_url: string,
    public description: string,
    public owner: { avatar_url: string },
  ) {}
}
