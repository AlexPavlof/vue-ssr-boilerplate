import fs                         from 'fs';
import path                       from 'path';
import LRU                        from 'lru-cache';
import express                    from 'express';
// import favicon                  from 'serve-favicon';
import compression                from 'compression';
import microcache                 from 'route-cache';
import { createBundleRenderer }   from 'vue-server-renderer';
import { version as expressVer }  from 'express/package.json';
import { version as rendererVer } from 'vue-server-renderer/package.json';

const resolve       = file => path.resolve(__dirname, file);
const isProd        = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';
const serverInfo    = `express/${expressVer} vue-server-renderer/${rendererVer}`;

/**
 * @type {Object}
 */
const app = express();

/**
 * @type {Function}
 */
const createRenderer = (bundle, options) => createBundleRenderer(bundle, Object.assign(options, {
    cache: new LRU({
        max:    1000,
        maxAge: 1000 * 60 * 15,
    }),
    basedir:         resolve('./dist'),
    runInNewContext: false,
}));

let renderer;
let readyPromise;
const templatePath = resolve('./src/index.template.html');

if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    // eslint-disable-next-line global-require,import/no-unresolved
    const bundle = require('./dist/vue-ssr-server-bundle.json');
    // eslint-disable-next-line global-require,import/no-unresolved
    const clientManifest = require('./dist/vue-ssr-client-manifest.json');
    renderer = createRenderer(bundle, {
        template,
        clientManifest,
    });
} else {
    // eslint-disable-next-line global-require,import/no-unresolved
    readyPromise = require('./build/setup-dev-server')(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options);
        },
    );
}

const serve = (servePath, cache) => express.static(resolve(servePath), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
});

app.use(compression({ threshold: 0 }));
// app.use(favicon('./public/logo-48.png'));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));
app.use('/manifest.json', serve('./manifest.json', true));
app.use('/service-worker.js', serve('./dist/service-worker.js'));

// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl));

function render(req, res) {
    const s = Date.now();

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Server', serverInfo);

    const handleError = (err) => {
        if (err.url) {
            res.redirect(err.url);
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error');

            // eslint-disable-next-line no-console
            console.error(`error during render : ${req.url}`);
            // eslint-disable-next-line no-console
            console.error(err.stack);
        }
    };

    const context = {
        title: 'Vue SSR sample page',
        url:   req.url,
    };

    // eslint-disable-next-line consistent-return
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err);
        }

        res.send(html);

        if (!isProd) {
            // eslint-disable-next-line no-console
            console.log(`whole request: ${Date.now() - s}ms`);
        }
    });
}

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server started at localhost:${port}`);
});
