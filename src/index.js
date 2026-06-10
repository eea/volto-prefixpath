import { parse as parseUrl } from 'url';
import {
  getSystemInformation,
  listControlpanels,
} from '@plone/volto/actions/controlpanels/controlpanels';
import installPrefixPath from './middleware/prefixPath';

const getServerURL = (url) => {
  if (!url) return;
  const apiPathURL = parseUrl(url);
  return `${apiPathURL.protocol}//${apiPathURL.hostname}${
    apiPathURL.port ? `:${apiPathURL.port}` : ''
  }`;
};
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const publicURL =
  (process.env.RAZZLE_PUBLIC_URL ||
    (__DEVELOPMENT__
      ? `http://${host}:${port}`
      : getServerURL(process.env.RAZZLE_API_PATH) ||
        `http://${host}:${port}`)) + (process.env.RAZZLE_PREFIX_PATH || '');

const applyConfig = (config) => {
  const prefixPath = process.env.RAZZLE_PREFIX_PATH;
  config.settings.prefixPath = prefixPath;
  config.settings.publicURL = publicURL;
  config.settings.apiPath = process.env.RAZZLE_API_PATH || publicURL;

  if (prefixPath) {
    const ControlPanelAsyncPropExtender = {
      path: `${prefixPath}/controlpanel`,
      extend: (dispatchActions) => {
        if (
          dispatchActions.filter(
            (asyncAction) => asyncAction.key === 'controlpanels',
          ).length === 0
        ) {
          dispatchActions.push({
            key: 'controlpanels',
            promise: ({ location, store: { dispatch } }) =>
              __SERVER__ && dispatch(listControlpanels()),
          });
        }
        return dispatchActions;
      },
    };
    const SystemInfoAsyncPropExtender = {
      path: `${prefixPath}/controlpanel`,
      extend: (dispatchActions) => {
        if (
          dispatchActions.filter(
            (asyncAction) => asyncAction.key === 'systemInformation',
          ).length === 0
        ) {
          dispatchActions.push({
            key: 'systemInformation',
            promise: ({ location, store: { dispatch } }) =>
              __SERVER__ && dispatch(getSystemInformation()),
          });
        }
        return dispatchActions;
      },
    };

    config.settings.asyncPropsExtenders = [
      ...(config.settings.asyncPropsExtenders || []),
      ControlPanelAsyncPropExtender,
      SystemInfoAsyncPropExtender,
    ];
  }
  //do not require initial re-redirect
  // if (__SERVER__) {
  //   const middleware = require('./middleware/prefixPath').default;

  //   config.settings.expressMiddleware = [
  //     ...config.settings.expressMiddleware,
  //     middleware(),
  //   ];
  // }

  // do not expand breadcrumbs
  config.settings.apiExpanders = [...config.settings.apiExpanders].filter(
    (item) => !item.GET_CONTENT.includes('breadcrumbs'),
  );

  config.settings.storeExtenders = [
    ...config.settings.storeExtenders,
    installPrefixPath,
  ];

  return config;
};

export default applyConfig;
