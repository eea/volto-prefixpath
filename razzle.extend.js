const plugins = (defaultPlugins) => {
  return defaultPlugins;
};
const modify = (config, { target, dev }, webpack) => {
  const prefixPath = process.env.RAZZLE_PREFIX_PATH || '';

  //   if (prefixPath) {
  //     if (target === 'web' && dev) {
  //       config.devServer.devMiddleware.publicPath = prefixPath;
  //     }
  //     console.log(config);
  //     const pp = config.output.publicPath;
  //     config.output.publicPath = `${pp}${prefixPath.slice(1)}/`;
  //   }

  return config;
};

module.exports = {
  plugins,
  modify,
};
