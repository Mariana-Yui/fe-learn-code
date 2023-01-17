import { Compiler } from 'webpack';
import { Options as MiniOptions } from 'html-minifier-terser';
export interface Options {
    replace?: Array<{
        from: string | RegExp;
        to: string;
    }>;
    filename?: string;
    minify?: MiniOptions | string | boolean;
    zip?: boolean;
    [prop: string]: any;
}
declare class NonstandardWebpackPlugin {
    private options;
    private apreHtml;
    constructor(options: Options);
    apply(compiler: Compiler): void;
    hookIntoCompiler(compiler: Compiler): void;
    hookWithZip(compiler: Compiler): Promise<void>;
}
export default NonstandardWebpackPlugin;
