'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var fs = require('fs');
var htmlMinifierTerser = require('html-minifier-terser');
var AdmZip = require('adm-zip');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var HtmlWebpackPlugin__namespace = /*#__PURE__*/_interopNamespaceDefault(HtmlWebpackPlugin);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

const projectPath = process.cwd();
class NonstandardWebpackPlugin {
    options;
    apreHtml;
    constructor(options) {
        const { replace = [], minify = 'auto', filename = 'apre_index.html', zip = false } = options;
        this.options = {
            replace,
            filename,
            minify,
            zip
        };
        this.apreHtml = '';
    }
    apply(compiler) {
        this.hookIntoCompiler(compiler);
        const { options } = compiler;
        const pluginName = NonstandardWebpackPlugin.name;
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            const { version } = HtmlWebpackPlugin__namespace;
            let hook;
            /** html-webpack-plugin ver4 breaking change */
            if (version >= 4) {
                hook = HtmlWebpackPlugin__namespace.getHooks(compilation).beforeEmit;
            }
            else {
                hook = compilation.hooks.htmlWebpackPluginAfterHtmlProcessing;
            }
            hook.tapPromise(pluginName, async (data) => {
                let apreHtml = data.html;
                this.options.replace.forEach(({ from, to }) => {
                    apreHtml = apreHtml.replace(from, to);
                });
                this.apreHtml = await htmlMinifierTerser.minify(apreHtml, this.options.minify);
                return data;
            });
        });
        /** after emit assets to output */
        compiler.hooks.afterEmit.tapPromise(pluginName, async (compilation) => {
            const outputPath = options.output.path;
            const aprePath = path__namespace.resolve(outputPath, this.options.filename);
            fs__namespace.writeFileSync(aprePath, this.apreHtml, { encoding: 'utf-8', flag: 'w+' });
            await this.hookWithZip(compiler);
        });
    }
    hookIntoCompiler(compiler) {
        const isProductionLikeMode = compiler.options.mode === 'production' || !compiler.options.mode;
        const minify = this.options.minify;
        if (minify === true || (minify === 'auto' && isProductionLikeMode)) {
            this.options.minify = {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            };
        }
    }
    async hookWithZip(compiler) {
        const folderPath = path__namespace.resolve(compiler.options.output.path);
        const zipName = `${path__namespace.basename(folderPath)}.zip`;
        const zipPath = path__namespace.resolve(projectPath, zipName);
        if (this.options.zip) {
            /** 先删除原来的 */
            fs__namespace.rmSync(zipPath, { force: true });
            try {
                const file = new AdmZip();
                file.addLocalFolder(folderPath);
                fs__namespace.writeFileSync(zipPath, file.toBuffer());
            }
            catch (error) {
                /** 记录报错日志 */
                fs__namespace.writeFileSync('./zip-error.log', `${new Date()}: ${error.message}\n`, { encoding: 'utf-8', flag: 'w+' });
                console.log('生成zip包出了点小问题, 请手动打包...');
            }
        }
    }
}

module.exports = NonstandardWebpackPlugin;
