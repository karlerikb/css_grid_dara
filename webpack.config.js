module.exports = {
  entry: "./app/js/app.ts",
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