const plugins = (defaultPlugins) => {
  return defaultPlugins;
};
const modify = (config, { target, dev }, webpack) => {
  const prefixPath = process.env.RAZZLE_PREFIX_PATH || '';
  if (prefixPath) {
    if (target === 'web' && dev) {
      if (config.devServer.devMiddleware)
        config.devServer.devMiddleware.publicPath = prefixPath;
      else config.devServer.publicPath += `${prefixPath.slice(1)}/`;
    }
    const pp = config.output.publicPath;

    //check if publicPath already has the prefixPath
    if (pp.indexOf(prefixPath) === -1)
      config.output.publicPath = `${pp}${prefixPath.slice(1)}/`;
  }
  return config;
};

module.exports = {
  plugins,
  modify,
};
