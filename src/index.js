import { getSystemInformation, listControlpanels } from '@plone/volto/actions';

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
  if (__SERVER__) {
    const middleware = require('./middleware/prefixPath').default;

    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      middleware(),
    ];
  }

  // do not expand breadcrumbs
  config.settings.apiExpanders = [...config.settings.apiExpanders].filter(
    (item) => !item.GET_CONTENT.includes('breadcrumbs'),
  );

  return config;
};

export default applyConfig;
