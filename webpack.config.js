const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    let config = {
        entry: './src/Game.ts',
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new CopyWebpackPlugin([
                {from: 'src/public/', to: 'public/'},
            ])
        ],
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'tslint-loader',
                            options: {
                                emitErrors: true,
                                configFile: 'tslint.json'
                            }
                        }
                    ]
                },
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            filename: 'game.js',
            path: path.resolve(__dirname, 'dist')
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 5000
        }
    };

    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
    }

    if (argv.mode === 'production') {
        config.optimization.minimizer = [new UglifyJsWebpackPlugin()];
    }

    return config;

};