import localForage from 'localforage';
import { Credentials, Configuration } from 'ganttlab-entities';

localForage.config({
  name: 'GanttLab',
});

export async function getRememberedCredentials(): Promise<{
  [key: string]: Credentials | null;
} | null> {
  try {
    const remember = await localForage.getItem('remember');
    if (remember) {
      const credentialsBySource: {
        [key: string]: Credentials | null;
      } | null = await localForage.getItem('credentialsBySource');
      if (credentialsBySource) {
        return credentialsBySource;
      }
      return null;
    }
  } catch (error) {
    return null;
  }

  return null;
}

export async function getRememberedCredentialsBySource(
  source: string,
): Promise<Credentials | null> {
  try {
    const remember = await localForage.getItem('remember');
    if (remember) {
      const credentialsBySource: {
        [key: string]: Credentials | null;
      } | null = await localForage.getItem('credentialsBySource');
      if (credentialsBySource && credentialsBySource[source]) {
        return credentialsBySource[source];
      }
      return null;
    }
  } catch (error) {
    return null;
  }

  return null;
}

export async function getRememberedSource(): Promise<string | null> {
  try {
    const remember = await localForage.getItem('remember');
    if (remember) {
      const source: string | null = await localForage.getItem('source');
      return source;
    }
  } catch (error) {
    return null;
  }

  return null;
}

export async function getRememberedViews(): Promise<{
  [source: string]: {
    slug: string;
    configuration: Configuration;
  };
} | null> {
  try {
    const remember = await localForage.getItem('remember');
    if (remember) {
      return await localForage.getItem('viewsBySource');
    }
  } catch (error) {
    return null;
  }

  return null;
}

export async function getRememberedViewsBySource(
  source: string,
): Promise<{
  slug: string;
  configuration: Configuration;
} | null> {
  try {
    const remember = await localForage.getItem('remember');
    if (remember) {
      const viewsBySource: {
        [source: string]: {
          slug: string;
          configuration: Configuration;
        } | null;
      } | null = await localForage.getItem('viewsBySource');
      if (viewsBySource && viewsBySource[source]) {
        return viewsBySource[source];
      }
      return null;
    }
  } catch (error) {
    return null;
  }

  return null;
}

export default localForage;
