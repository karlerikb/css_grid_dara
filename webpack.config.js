module.exports = {
  entry: "./app/js/App.ts",
  output: {
    filename: "./bundle.js"
  },
  devtool:"source-map",
  resolve: {
      extensions: ["*",".ts",".tsx",".js"]
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
}