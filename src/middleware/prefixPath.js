import config from '@plone/volto/registry';

const prefixPath = () => (next) => (action) => {
  if (typeof action === 'function') {
    return next(action);
  }

  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      const { pathname } = action.payload.location;
      const { prefixPath } = config.settings;
      if (!prefixPath) {
        break;
      }

      if (!pathname.match(new RegExp(`^${prefixPath}(/|$)`))) {
        const newPathname = `${prefixPath}${pathname === '/' ? '' : pathname}`;
        action.payload.location.pathname = newPathname;
        window.location.replace(newPathname);
      }
      return next(action);
    default:
      return next(action);
  }

  return next(action);
};

const install = (middlewaresList) => [prefixPath, ...middlewaresList];

export default install;
