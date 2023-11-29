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
    const express = require('express');
    const path = require('path');
    const server = express.Router();

    if (process.env.RAZZLE_PREFIX_PATH) {
      server.use(
        process.env.RAZZLE_PREFIX_PATH,
        express.static(
          process.env.BUILD_DIR
            ? path.join(process.env.BUILD_DIR, 'public')
            : process.env.RAZZLE_PUBLIC_DIR,
          {
            redirect: false, // Avoid /my-prefix from being redirected to /my-prefix/
          },
        ),
      );
    }

    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      middleware(),
    ];
  }

  return config;
};

export default applyConfig;
