import axios from 'axios';
import { AxiosBackedAuthenticatableSource } from '../abstracts/AxiosBackedAuthenticatableSource';
import { Credentials, User } from 'ganttlab-entities';
import { GitHubUser } from './types/GitHubUser';
import { GitHubRepository } from './types/GitHubRepository';

export class GitHubGateway extends AxiosBackedAuthenticatableSource {
  public slug = 'github';
  public name = 'GitHub';

  setCredentials(credentials: Credentials): void {
    this.credentials = { token: credentials.token };
    this.setAxiosInstance(
      axios.create({
        baseURL: 'https://api.github.com/',
        headers: {
          common: {
            Authorization: `token ${this.credentials.token}`,
          },
        },
      }),
    );
  }

  getUrl(): string | null {
    return 'https://github.com';
  }

  async getLoggedInUser(): Promise<User> {
    const { data } = await this.safeAxiosRequest<GitHubUser>({
      method: 'GET',
      url: '/user',
    });
    return new User(data.email, data.login, data.html_url, data.avatar_url);
  }

  async searchRepositories(search: string): Promise<GitHubRepository[]> {
    const { data } = await this.safeAxiosRequest<{
      items: Array<GitHubRepository>;
    }>({
      method: 'GET',
      url: '/search/repositories',
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        per_page: 10,
        q: search,
      },
    });
    const projectsList: Array<GitHubRepository> = [];
    for (const repo of data.items) {
      projectsList.push(
        new GitHubRepository(
          repo.name,
          repo.full_name,
          repo.html_url,
          repo.description,
          // eslint-disable-next-line @typescript-eslint/camelcase
          { avatar_url: repo.owner.avatar_url },
        ),
      );
    }
    return projectsList;
  }
}
