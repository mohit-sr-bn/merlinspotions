const path = require('path')
const webpack = require('webpack')

const inDebug = process.env.NODE_ENV === 'debug'

module.exports = {
    mode: 'development',
    devtool: process.env.NODE_ENV === 'production' ? false : 'sourcemap',
    entry: './app/main.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'main.js',
        library: 'main',
        libraryTarget: 'commonjs2'
    },
    externals: {
        express: 'commonjs express',
        jsdom: 'commonjs jsdom',
        encoding: 'commonjs encoding',
        ajv: 'commonjs ajv'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'progressive-web-sdk': path.resolve(__dirname, 'node_modules/progressive-web-sdk'),
            'mobify-integration-manager': path.resolve(__dirname, 'node_modules/mobify-integration-manager'),
            // This alias lets us import files from the web directory using 'web/path'
            // instead of '../../web/path'
            web: path.resolve(__dirname, '..', 'web'),
            // This is necessary to avoid the .mjs file being used, which fails
            // under webpack 4.
            'node-fetch': path.resolve(
                process.cwd(),
                'node_modules/progressive-web-sdk/node_modules/node-fetch/lib/index.js'
            )
        }
    },
    module: {
        rules: [
            // Run the project files through the babel-loader to transpile them from es6
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory=true',
                options: {
                    plugins: ['syntax-dynamic-import']
                }
            },
            // Supply a stub window object to the Progressive Web SDK files
            {
                test: /\.js(x?)$/,
                include: /progressive-web-sdk/,
                use: [
                    {
                        loader: `imports-loader?window=>{location: {href: 'about:blank'}},window.addEventListener=>function(){}`
                    }
                ],
            },
            // Provide a loader for SCSS files
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'css-loader?-autoprefixer',
                        options: {
                            minimize: true,
                            // Don't use css-loader's automatic URL transforms
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.join(__dirname, 'app', 'styles')]
                        }
                    }
                ]
            },
            // Provide a loader for SVG files
            {
                test: /\.svg$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            fetch: 'node-fetch',
            URL: ['whatwg-url', 'URL']
        }),
        new webpack.DefinePlugin({
            // This is defined as a boolean, not a string
            DEBUG: `${inDebug}`,
            WEBPACK_SSR_ENABLED: 'false',
            WEBPACK_PROXY1_PATH: "''",
            WEBPACK_PROXY2_PATH: "''"
        })
    ]
}
