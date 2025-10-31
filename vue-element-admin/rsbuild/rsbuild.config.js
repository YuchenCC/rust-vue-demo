const { defineConfig, loadEnv } = require('@rsbuild/core');
const { pluginVue2 } = require('@rsbuild/plugin-vue2');
const { pluginSass } = require('@rsbuild/plugin-sass');
const { pluginVue2Jsx } = require('@rsbuild/plugin-vue2-jsx');
const { pluginBabel } = require('@rsbuild/plugin-babel')
const { pluginNodePolyfill } = require('@rsbuild/plugin-node-polyfill')
const path = require('path');

// 项目根目录（配置文件在 rsbuild 文件夹内，父目录即项目根目录）
const projectRoot = path.join(__dirname, '..');

// 加载环境变量
const { publicVars } = loadEnv({
    prefixes: ['VUE_APP_', 'PUBLIC_'], // 手动加载 VUE_APP_ 环境变量
    cwd: projectRoot, // 指定环境变量文件所在的目录
})

function resolve(dir) {
    return path.join(projectRoot, dir)
}

module.exports = defineConfig({
    // === 1. 插件 ===
    plugins: [
        pluginVue2(),
        pluginSass({
            // 等价于 vue.config.js → css.loaderOptions.sass
            sassOptions: {
                javascriptEnabled: true,
            },
            // additionalData: `
            //   @import "@/styles/variables.scss";
            //   @import "@/styles/mixin.scss";
            // `,
        }),
        pluginVue2Jsx(),
        pluginBabel({
            // 给 JS/TS 统一加上 Vue2 JSX 预设
            presets: [['@vue/babel-preset-jsx', { /* options 可留空 */ }]],
            // 如果只想对特定目录/文件生效，可加 include/exclude
        }),
        pluginNodePolyfill()
    ],
    resolve: {
        alias: {
            '@': resolve('src'),
        },
    },
    // === 2. 源配置（入口、别名等）===
    source: {
        entry: {
            app: resolve('src/main.js'),
        },
        define: {
            ...publicVars,
            // 如果还想注入 process.env.NODE_ENV 也可以手动声明：
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
    },

    // === 3. HTML 模板 ===
    html: {
        template: resolve('public/index2.html'),
        title: 'vue Element Admin',
    },

    // === 4. 开发服务器（对应 devServer）===
    server: {
        port: 9527,
        open: true,
        proxy: {
            // 全量代理到本地 9527（若仅需部分前缀可改为 '/api'）
            '/dev-api': {
                target: 'http://localhost:9528',
                changeOrigin: true,
            },
        },
        // Rsbuild 不支持 before() 钩子，可以通过自定义 middleware 模式实现：
        // setupMiddlewares: [require(resolve('mock/mock-server.js'))]
    },

    // === 5. 输出构建配置 ===
    output: {
        assetPrefix: '/',            // publicPath
        distPath: { root: 'dist', js: 'static/js', css: 'static/css', media: 'static/media' },
        filenameHash: true,
        sourceMap: { js: false, css: false },
    },

    // === 6. 工具层（等价 configureWebpack + chainWebpack）===
    tools: {
        rspack: {
            performance: { hints: false },
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        libs: {
                            name: 'chunk-libs',
                            test: /[\\/]node_modules[\\/]/,
                            priority: 10,
                            chunks: 'initial',
                        },
                        elementUI: {
                            name: 'chunk-elementUI',
                            priority: 20,
                            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                        },
                        commons: {
                            name: 'chunk-commons',
                            test: resolve('src/components'),
                            minChunks: 3,
                            priority: 5,
                            reuseExistingChunk: true,
                        },
                    },
                },
                runtimeChunk: 'single',
            },
        },

        // 等价 chainWebpack，可用 bundlerChain 操作 Rspack Chain API
        bundlerChain(chain, { CHAIN_ID, rspack }) {
            // 关闭 prefetch 插件
            chain.plugins.delete('prefetch')

            // 设置 svg-sprite-loader
            chain.module.rule('svg').exclude.add(resolve('src/icons')).end()
            chain.module
                .rule('icons')
                .test(/\.svg$/)
                .include.add(resolve('src/icons'))
                .end()
                .use('svg-sprite-loader')
                .loader('svg-sprite-loader')
                .options({ symbolId: 'icon-[name]' })

            // 启用 preload 优化
            // chain.plugin('preload').tap(() => [
            //     {
            //         rel: 'preload',
            //         fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
            //         include: 'initial',
            //     },
            // ])
        },
        cssLoader: (opts) => {
            // 开启 CSS Modules，并仅对目标文件生效
            opts.modules = {
              ...(opts.modules || {}),
              auto: (resPath) =>
                /[/\\]styles[/\\]variables\.scss$/.test(resPath) || /\.module\.scss$/.test(resPath),
            }
            return opts
          },
    },
})

