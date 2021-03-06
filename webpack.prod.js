const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const routes = require('./routes')
//ToDo:
//Decouple the object in the marge function.
//Concat paths into an array, according to the interiors of "routes" folder.
//Place it in the "plugins" array.
//Then concat the new objects in 



module.exports = merge(common, {
  mode: "production",
  //devtool: "none",
  devtool: 'source-map',
  //Outputs the production build into "dist" folder
  output: {
    filename: "[name].bundle.[contentHash].js", // Content Hash prevents the browser from using the wrong js file from the cache.
    path: path.resolve(__dirname, "dist")
  },

  //Deletes the previous "dist" folder for each build.
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contentHash].css",
      chunkFilename: "[id].[contenthash].css"
    }),
    
    //Exports an HTML in the dist.
    ...routes.buildTemplates,


    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({grid: true})
        ]
      }
    })
  ],

  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ],
  },

  module: {
    rules: [
      //CSS
      {
        test: /\.css$/,
        use: [                          //  The order is important.
          MiniCssExtractPlugin.loader,  //  2) extracts the CSS into a seperate file
          "css-loader",                 //  1) takes CSS and turns it into JS
          "postcss-loader",             //  0) Modifies the final CSS
        ]
      },
      
      //SASS
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,  // 4) extracts the CSS into a seperate file
          "css-loader",                 // 3) translates CSS into CommonJS
          "postcss-loader",             // 2) Modifies the final CSS
          "sass-loader",                 // 1) compiles Sass to CSS, using Node Sass by default
        ]
      },
    ]
  },
});
