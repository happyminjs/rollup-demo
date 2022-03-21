import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'
import path from 'path'
import less from 'rollup-plugin-less';
import commonjs from 'rollup-plugin-commonjs';
import json from "@rollup/plugin-json";
import { terser } from 'rollup-plugin-terser';



export default {
  input: 'src/index.ts',
  output: {
    // name: 'Vue', // window.VueReactivity
    format: 'umd',
    file: path.resolve('dist/detail.js'), // 输出文件路径
    sourcemap: true, // 生成映射文件
  },
  plugins: [
    less(),
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    json(),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    terser(),
    serve({
      open: true,
      openPage: '/src/index.html',
      port: 9000,
      contentBase: ''
    })
  ]
}