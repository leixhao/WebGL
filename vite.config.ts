import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './vite/plugins';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV, VITE_APP_BASE_API, NODE_ENV } = env;
  return {
    plugins: [
      createVitePlugins(env, command === 'build'),
      visualizer()
    ],
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // publicPath: NODE_ENV === 'production' ? '/aesc/' : '/aesc/',
    // // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
    // outputDir: 'dist',
    // // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    // assetsDir: 'static',
    // 是否开启eslint保存检测，有效值：ture | false | 'error'
    //例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/
    base: '/ecm/',
    lintOnSave: !NODE_ENV,
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        [VITE_APP_BASE_API]: {
          target: `http://tech-d.envision-aesc.cn`,
          // target: `http://10.206.121.15:32471/`,
          //  http://tech-d.envision-aesc.cn/api 开发环境
          //http://tech-q.envision-aesc.cn/api 测试境
          //http://tech.envision-aesc.cn/api 生产环境
          changeOrigin: true,
          rewrite: p => p.replace(/^\/[VITE_APP_BASE_API:]/, '/api')
        },
      },
    },
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.js', '.ts', '.vue'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks(id) {
           if (id.includes('node_modules')) {
              if(id.includes('element-plus/theme')){
                return 'ele'
              }else{
                return 'vendor';
              }
             
            }
          },
        },
        treeshake:{
          moduleSideEffects: 'no-external',
        },
        external: [
          // 将需要跳过校验的模块添加到external数组中
          'vue/compiler-sfc',
        ],
      },
    },
  };
});
