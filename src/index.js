import {
  getSystemInformation,
  listControlpanels,
} from '@plone/volto/actions/controlpanels/controlpanels';
import installPrefixPath from './middleware/prefixPath';

const applyConfig = (config) => {
  const prefixPath = process.env.RAZZLE_PREFIX_PATH;
  config.settings.prefixPath = prefixPath;
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

  // Do not expand breadcrumbs, but keep the other expanders that ship in the
  // same entry (`actions`, `types`, `navroot`). Removing the whole entry makes
  // Volto issue separate requests to /@breadcrumbs, /@types, ... for every
  // content url. On a moved/renamed path those sub-requests 404, and the
  // auth-only /@types one rejects without a handler and crashes the SSR
  // process (the pod then goes down and Varnish answers 503).
  config.settings.apiExpanders = config.settings.apiExpanders.map((item) =>
    Array.isArray(item.GET_CONTENT) && item.GET_CONTENT.includes('breadcrumbs')
      ? {
          ...item,
          GET_CONTENT: item.GET_CONTENT.filter((e) => e !== 'breadcrumbs'),
        }
      : item,
  );

  config.settings.storeExtenders = [
    ...config.settings.storeExtenders,
    installPrefixPath,
  ];

  return config;
};

export default applyConfig;
