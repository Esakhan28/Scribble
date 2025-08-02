const path = require("path");

module.exports = {
  resolve: {
    alias: {
      apis: "src/apis",
      common: "src/common",
      components: "src/components",
      channels: "src/channels",
      lib: "src/lib",
      neetoui: "@bigbinary/neetoui",
      neetoicons: "@bigbinary/neeto-icons",
      images: path.resolve(__dirname, "../", "../", "app/assets/images"),
    },
  },
};
