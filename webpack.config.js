var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        './src/index',
//         'webpack-dev-server/client?http://127.0.0.1:8080/',
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: "bundle.js"
    },
    resolve: {
        moduleDirectories: ['node_modules','src'],
        extensions: ['','.js','.json']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [__dirname + "/src"],
                exclude: /node_modules/,
                loader: ['babel-loader'],
                query: {
                    presets: ['es2015','react']
                }
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
            }
        ]
    }
};
