/* eslint-disable no-console */
import { resolve }            from 'path';
import { mode, isProduction } from './mode';
import ruleJs                 from './rules/js';
import ruleLess               from './rules/less';
// import ruleFonts       from './webpack/rules/fonts';
import ruleVue                from './rules/vue';
import ruleSvg                from './rules/svg';
import VueLoaderPlugin        from './plugins/vue-loader';

export default {
    mode,
    context: resolve(__dirname, '../src'),
    output:  {
        path:       resolve(__dirname, '../dist/'),
        publicPath: '/dist/',
    },
    target:  'web',
    cache:   true,
    plugins: [
        VueLoaderPlugin,
    ],
    module: {
        noParse: /es6-promise\.js$/,
        rules:   [
            ruleJs,
            ruleLess,
            // ruleFonts,
            // ruleImages,
            ruleVue,
            ruleSvg,
        ],
    },
    performance: {
        hints: !isProduction,
    },
    // stats:   !isProduction,
    devtool: isProduction ? 'none' : 'source-map',
    resolve: {
        modules: ['node_modules'],
    },
    devServer: {
        compress:   true,
        port:       9000,
        publicPath: '/static/',
        proxy:      {
            '/': 'http://localhost:8000',
        },
        index:    'index.html',
        filename: 'bundle.js',
    },
};
