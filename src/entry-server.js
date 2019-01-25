/* eslint-disable consistent-return,prefer-promise-reject-errors,no-console */
import { createApp } from './app';

/**
 * Is server running in dev-mode.
 *
 * @type boolean
 */
const isDev = process.env.NODE_ENV !== 'production';

/**
 * This exported function will be called by `bundleRenderer`.
 * This function perform data-prefetching to determine the state of application
 * before actually rendering it. Since data fetching is async, this function is
 * expected to return a Promise that resolves to the app instance.
 *
 * @param  {Object}     context
 * @return Promise<any>
 */
export default context => new Promise((resolve, reject) => {
    /**
     * Function start time to measure runtime.
     *
     * @type {Number}
     */
    const startTime = Date.now();

    const { app, router, store } = createApp();
    const { url }                = context;
    const { fullPath }           = router.resolve(url).route;

    if (fullPath !== url) {
        return reject({ url: fullPath });
    }

    router.push(url);

    router.onReady(() => {
        /**
         * Matched components.
         *
         * @type Array<Object>
         */
        const matchedComponents = router.getMatchedComponents();

        if (!matchedComponents.length) {
            return reject({ code: 404 });
        }

        Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
            store,
            route: router.currentRoute,
        }))).then(() => {
            if (isDev) console.log(`data pre-fetch: ${Date.now() - startTime}ms`);

            context.state = store.state;

            resolve(app);
        }).catch(reject);
    }, reject);
});
