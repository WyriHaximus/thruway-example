const path = require('path');
const react = require('react');
const DefinePlugin = require("webpack/lib/DefinePlugin");
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry: {
        'app': './js/app.js',
    },
    output: {
        path: __dirname + '/public/',
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js',
        crossOriginLoading: 'anonymous',
    },
    optimization: {
        minimizer: [
            new BabelMinifyPlugin(),
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 1024,
            minChunks: 1,
            maxAsyncRequests: 50,
            maxInitialRequests: 5,
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
    ],
    stats: {
        colors: true,
        warnings: false,
    },
};
