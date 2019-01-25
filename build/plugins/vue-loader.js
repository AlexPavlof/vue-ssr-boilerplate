import VueLoaderPlugin from 'vue-loader/lib/plugin';

/**
 * Отвечает за клонирование любых других правил,
 * которые вы определили, чтобы применить их
 * к соответствующим языковым блокам в файлах .vue
 *
 * @type {VueLoaderPlugin}
 * @see https://github.com/vuejs/vue-loader
 */
const LoaderPlugin = new VueLoaderPlugin();

export default LoaderPlugin;
