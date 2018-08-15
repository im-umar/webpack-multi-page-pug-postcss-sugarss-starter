const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require("./config");
const root = path.resolve(__dirname, '..');

let HTMLPlugins = [];

// 入口文件集合
let Entries = {};

// 生成多页面的集合
config.HTMLDirs.forEach((page) => {
  const htmlPlugin = new HTMLWebpackPlugin({
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/pug/${page}.pug`),
    // chunks: [page, 'vendor', 'styles'],
    // hash: true, // 防止缓存
  })
  HTMLPlugins.push(htmlPlugin);
  Entries = path.resolve(__dirname, `../src/app.js`);
})

module.exports = {
  entry: Entries,
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'pug-html-loader'
          }
        ]
      },
      {
        // 对 sss 后缀名进行处理
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              ident: 'postcss',
              parser: 'sugarss',
              plugins: () => [
                require('autoprefixer'),
                require('postcss-nested'),
                require('postcss-simple-vars'),
                require('postcss-import'),
                require('postcss-preset-env')({
                  browsers: 'last 2 versions',
                  stage: 1
                }),
              ],
            },
          },
        ],
      },
      // {
      //   // 对 css 后缀名进行处理
      //   test: /\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader'
      //     }
      //   ]
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: 'images/[name].[ext]?[hash:8]'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: "fonts/[name].[ext]?[hash:8]"
          }
        }
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },{
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  resolve: {
    alias: {
      img: path.join(root, 'src/img'),
      css: path.join(root, 'src/css'),
      pug: path.join(root, 'src/pug'),
      js: path.join(root, 'src/js'),
      // common: path.join(root, 'src/common'),
      components: path.join(root, 'src/components')
    },
    extensions: ['.js'] // 引用js文件可以省略后缀名
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    ...HTMLPlugins
  ],
  
}