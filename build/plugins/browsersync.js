import BrowserSyncPlugin from 'browser-sync-webpack-plugin';

const SyncPlugin = new BrowserSyncPlugin({
    host:  'localhost',
    port:  3000,
    proxy: 'http://localhost:9000/',
});

export default SyncPlugin;
