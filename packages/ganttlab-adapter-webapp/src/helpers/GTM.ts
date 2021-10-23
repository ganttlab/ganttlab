declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any;
  }
}

interface Variables {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const containerId: string | undefined = process.env.VUE_APP_GTM_CONTAINER_ID;
const debug: boolean = process.env.VUE_APP_GTM_DEBUG ? true : false;

const hasScriptInDocument = () => {
  return Array.from(document.getElementsByTagName('script')).some((script) =>
    script.src.includes('googletagmanager'),
  );
};

const loadGtmScript = (): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
  const firstDocumentScript = document.getElementsByTagName('script')[0];
  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + containerId;
  if (firstDocumentScript.parentNode) {
    firstDocumentScript.parentNode.insertBefore(gtmScript, firstDocumentScript);
  }
};

const doesUserAllowsTracking = (): boolean => {
  const browserDnt = window.doNotTrack || navigator.doNotTrack;

  if (!browserDnt) return true;
  return browserDnt !== '1' ? true : false;
};

const gtmTrack = (eventName: string, variables: Variables) => {
  const hasScript = hasScriptInDocument();
  const hasScriptString = hasScript ? 'HasScript' : 'NoScript';
  const userAllowsTracking = doesUserAllowsTracking();
  const allowString = userAllowsTracking ? 'AllowsTracking' : 'DoNotTrack';
  if (debug) {
    console.info(
      `GTM Track (${containerId} - ${hasScriptString} - ${allowString}): ${eventName}`,
      variables,
    );
  }
  if (!containerId || !userAllowsTracking) {
    // just don't do anything!
    return;
  }
  if (!hasScript) {
    loadGtmScript();
  }

  window.dataLayer.push({
    event: eventName,
    ...variables,
  });
};

export function trackVirtualpageView(name: string, path: string): void {
  gtmTrack('virtualpage-view', {
    name,
    path,
  });
}

export function trackInteractionEvent(
  category: string,
  action: string,
  label?: string,
  value?: number,
): void {
  gtmTrack('interaction-event', {
    category,
    action,
    label,
    value,
  });
}
