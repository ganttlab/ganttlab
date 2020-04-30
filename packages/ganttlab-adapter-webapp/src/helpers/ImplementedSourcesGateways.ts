import { GitHubGateway, GitLabGateway } from 'ganttlab-gateways';
import { Source, AuthenticatableSource } from 'ganttlab-entities';

interface SourceGateway {
  name: string;
  slug: string;
  icon: string;
  module: typeof Source | typeof AuthenticatableSource;
}

export const ImplementedSourcesGateways: Array<SourceGateway> = [
  {
    name: 'GitLab',
    slug: 'gitlab',
    icon: 'logo-gitlab',
    module: GitLabGateway,
  },
  {
    name: 'GitHub',
    slug: 'github',
    icon: 'logo-github',
    module: GitHubGateway,
  },
];

export function getBySlug(slug: string): Source | AuthenticatableSource | null {
  const theGatewayClass = ImplementedSourcesGateways.find(
    (gateway) => gateway.slug === slug,
  )?.module;
  if (theGatewayClass) {
    return new theGatewayClass();
  }
  return null;
}
