const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        jquery: './src/js/jquery-3.4.1.min.js', // Include jQuery
        bootstrap: './src/js/bootstrap.js', // Include Bootstrap JS
        custom: './src/js/custom.js', // Your custom JS
        styles: [
            './src/css/bootstrap.css',
            './src/css/responsive.css',
            './src/css/style.css',
            './src/css/style.scss' // Include your main SCSS file here
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/',        
        clean: true, // Clean output directory before emit
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            {
                test: /\.scss$/, // To process SCSS files
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/, // To process JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Optional: for ES6+ support
                },
            },
            
        ],
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['jquery', 'bootstrap', 'custom', 'styles'] // Include your styles here
        }),
        new HtmlWebpackPlugin({
            template: './src/about.html',
            filename: 'about.html',
            chunks: ['jquery', 'bootstrap', 'custom', 'styles'] // Include your styles here
        }),
        new HtmlWebpackPlugin({
            template: './src/contact.html',
            filename: 'contact.html',
            chunks: ['jquery', 'bootstrap', 'custom', 'styles'] // Include your styles here
        }),
        new HtmlWebpackPlugin({
            template: './src/price.html',
            filename: 'price.html',
            chunks: ['jquery', 'bootstrap', 'custom', 'styles'] // Include your styles here
        }),
        new HtmlWebpackPlugin({
            template: './src/service.html',
            filename: 'service.html',
            chunks: ['jquery', 'bootstrap', 'custom', 'styles'],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/images', to: 'images' }
            ],
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'], // Make sure Popper is available globally
        }),
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    mode: 'development',
    devtool: 'source-map', // Enable source maps for both JS and CSS
    devServer: {
        compress: true,
        allowedHosts: "all"
    }
};
