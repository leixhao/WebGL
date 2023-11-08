import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './vite/plugins';
import path from 'path';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, process.cwd());
    const { VITE_APP_ENV, VITE_APP_BASE_API } = env;
    return {
        plugins: createVitePlugins(env, command === 'build'),
        // 部署生产环境和开发环境下的URL。
        // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
        // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
        base: VITE_APP_ENV === 'production' ? '/' : '/',
        server: {
            port: 80,
            host: true,
            open: true,
            proxy: {
                [VITE_APP_BASE_API]: {
                    target: `http://tech-q.envision-aesc.cn`,
                    //  http://tech-d.envision-aesc.cn/api 开发环境
                    //http://tech-q.envision-aesc.cn/api 测试环境
                    //http://tech.envision-aesc.cn/api 生产环境
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/[VITE_APP_BASE_API:]/, '/api'),
                    // pathRewrite: {
                    //     ['^' + process.env.VUE_APP_BASE_API]: '/api'
                    // }
                }
            },
        },
        resolve: {
            alias: {
                // 设置路径
                '~': path.resolve(__dirname, './'),
                // 设置别名
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('element-plus/theme')) {
                            return 'ele';
                        }
                    },
                },
            },
        },
    };
});
