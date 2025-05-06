//запуск проекта + сервер + вотчинг = npm run start
//режим продакшен npm run build
//npm ls --depth=0 покажет установленные пакеты

const webpack = require('webpack');
const path = require('path');
//модуль Node.js Path является встроенным и предоставляет набор функций для работы с путями в файловой системе. Учитывает различия в операционках и путь к файлу
const HtmlWebpackPlugin = require('html-webpack-plugin');
//Uglify в новом вебпаке уже встроен
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");



module.exports = {
  //чтобы не писать абсолютный путь из одной папки к разным файлам по сто раз
  context: path.resolve(__dirname, 'src'),
   // Указываем входную точку, обязательно файл js не являющийся модулем. На каждую страницу - одна точка входа. Исп методы Node js
  entry: {
    home: './index.js',
    about: './about.js'
  },
  output: {
     // Полный путь к директории, где будет храниться конечный файл
    path: path.resolve(__dirname, 'dist'),
    // Указываем имя этого файла, файлов может быть много (scss, png), поэтому имя файла указ. отдельной строчкой
    //чтобы браузер не кешировал файл, а заменял новым, мы добавляем автогенерацию названия после изменения в файле - вставка хэш функции
    filename: '[name].[contenthash].js',
    //добавление кода js из каждого файла входа в отдельную переменную с таким же именем
    library: '[name]',
    publicPath: '',
    chunkFilename: '[name].[contenthash].chunk.js',
    //Очистка папки dist
    clean: true
  },
  optimization: {
    // splitChunks: {
    //   // Разделять все чанки
    //   cacheGroups: {
    //     vendors: { //выделяет в отдельные чанки - файл vendors.js - папку node_modules и библиотеки, который кэшируется
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       chunks: "all",
    //     },
    //   },
    // },
      //настройка встроенного uglify - минимизатора для js
    // minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     extractComments: false,
    //   }),
    // ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'index',
      inject: 'body',
      template: './pages/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      title: 'about',
      inject: 'body',
      template: './pages/about.html',
      filename: 'about.html',
      chunks: ['about'],
      //добавляет путь к иконке сайта
      //favicon: './pictures/icons/favicon.svg'
      //meta: {
        //viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
        // Вставляет в шапку сайта стандартный метатег
      //},

    }),
    // Автоматически в продакшене плагин минифицирует всё
    new MiniCssExtractPlugin(
    {
      filename: "[name].[contenthash].css",
      // chunkFilename: "[id].[contenthash].css"
    }
  )
  ],

  //подключенные модули, их настройки
  module: {
    rules: [
      { 
        //тест (функция в лоадере) проверяет правильность расширения файла
        test: /\.html$/, 
        //название лоадера
        use: 'raw-loader'
      },
      //Настройки для babel react
      // {
      //   test: /\.m?js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ['@babel/preset-env']
      //     }
      //   }
      // }
    ],
    rules: [
      {
        // Регулярное выражение для обработки файлов с расширением .scss, она же точка входа, которую нужно проверить
        test: /\.s[ac]ss$/i,
        // Загрузчики, используемые для обработки CSS-файлов, порядок запуска читается справа-налево. Сначала сасс преобразуется в ссс, потом в массив, который импортируется в js
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/'), // Каталог для статики
    },
    open: true, // Автоматически открывать браузер
    hot: true  //Автоматически обновлять при изменениях. ВНИМАНИЕ горячая перезагрузка конфликтовала с последней версией sass, поправила это
  },
  //соурсмап для продакшена
  //devtool: 'source-map',

  //соурсмап для работы
  devtool: 'source-map',
  mode: 'development', // Режим сборки для разработки, обязателен. Не удаляет комментарии, пробелы и пр.
};