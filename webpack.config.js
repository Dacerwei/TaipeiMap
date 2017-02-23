var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js"
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        moduleDirectories: ['node_modules','src'],
        extensions: ['','.js','.json']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [__dirname + "/src"],
                exclude: /node_modules/,
                loaders: ['react-hot-loader','babel-loader'],
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
                loader: 'file',
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.mp4$/,
                loader: 'url?limit=10000&mimetype=video/mp4'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
};
