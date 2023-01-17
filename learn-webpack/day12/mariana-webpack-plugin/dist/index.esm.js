import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as fs from 'fs';
import { minify } from 'html-minifier-terser';
import AdmZip from 'adm-zip';

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
            const { version } = HtmlWebpackPlugin;
            let hook;
            /** html-webpack-plugin ver4 breaking change */
            if (version >= 4) {
                hook = HtmlWebpackPlugin.getHooks(compilation).beforeEmit;
            }
            else {
                hook = compilation.hooks.htmlWebpackPluginAfterHtmlProcessing;
            }
            hook.tapPromise(pluginName, async (data) => {
                let apreHtml = data.html;
                this.options.replace.forEach(({ from, to }) => {
                    apreHtml = apreHtml.replace(from, to);
                });
                this.apreHtml = await minify(apreHtml, this.options.minify);
                return data;
            });
        });
        /** after emit assets to output */
        compiler.hooks.afterEmit.tapPromise(pluginName, async (compilation) => {
            const outputPath = options.output.path;
            const aprePath = path.resolve(outputPath, this.options.filename);
            fs.writeFileSync(aprePath, this.apreHtml, { encoding: 'utf-8', flag: 'w+' });
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
        const folderPath = path.resolve(compiler.options.output.path);
        const zipName = `${path.basename(folderPath)}.zip`;
        const zipPath = path.resolve(projectPath, zipName);
        if (this.options.zip) {
            /** 先删除原来的 */
            fs.rmSync(zipPath, { force: true });
            try {
                const file = new AdmZip();
                file.addLocalFolder(folderPath);
                fs.writeFileSync(zipPath, file.toBuffer());
            }
            catch (error) {
                /** 记录报错日志 */
                fs.writeFileSync('./zip-error.log', `${new Date()}: ${error.message}\n`, { encoding: 'utf-8', flag: 'w+' });
                console.log('生成zip包出了点小问题, 请手动打包...');
            }
        }
    }
}

export { NonstandardWebpackPlugin as default };
