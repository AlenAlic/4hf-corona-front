// Version used for forcing file cache invalidation in exceptional cases
const VERSION = "1";

module.exports = {
  transpileDependencies: ["vuetify"],
  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js"
    },
    themeColor: "#1976D2",
    msTileColor: "#FFFFFF",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black"
  },
  productionSourceMap: false,
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // Add version suffix to file names to force cache invalidation (CDN, Browser, and SW) in exceptional cases
      config.output.filename(`js/[name].[contenthash:8].v${VERSION}.js`);
      config.output.chunkFilename(`js/[name].[contenthash:8].v${VERSION}.js`);
      // Don't copy over testing and dev configs
      config.plugin("copy").tap(([options]) => {
        options[0].ignore.push("config/testing.json");
        options[0].ignore.push("config/development.json");
        return [options];
      });
    }
    // Don't copy over .example files
    config.plugin("copy").tap(([options]) => {
      options[0].ignore.push("*.example");
      return [options];
    });
    config.plugin("define").tap(args => {
      let _base = args[0]["process.env"];
      args[0]["process.env"] = {
        ..._base,
        SOCKET_URL: JSON.stringify(process.env.SOCKET_URL)
      };
      return args;
    });
  },
  css: {
    extract:
      process.env.NODE_ENV === "production"
        ? {
            filename: `css/[name].[contenthash:8].v${VERSION}.css`,
            chunkFilename: `css/[name].[contenthash:8].v${VERSION}.css`
          }
        : undefined
  }
};
