import clear from 'rollup-plugin-clear';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import postcss from "rollup-plugin-postcss";
import alias from '@rollup/plugin-alias';
import image from '@rollup/plugin-image';
import dev from 'rollup-plugin-dev'
export default {
	input: ['./src/index.jsx'],
	output: {
		name: 'react-project',
		file: 'dist/main.js',
		format: 'es'
	},
	context: 'null',
	moduleContext: 'null',
	plugins: [
		alias({
			entries: [
				{ find: '@', replacement: './src' },
				{ find: 'public', replacement: './public' }
			]
		}),
		image(),
		clear({
			targets: ['dist']
		}),
		nodeResolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs({
			include: ["node_modules/**"],
		}),
		replace({
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify('production') // 否则会报：process is not defined的错
		}),
		postcss(),
		babel({
			babelHelpers: 'runtime',
			'plugins': ["@babel/plugin-transform-runtime"],
			exclude: 'node_modules/**', // 只编译源代码
		}), // 会自动读取babel的配置文件
		terser(),
		dev({
			dirs: ['dist'],
			// proxy: [{ from: '/api', to: 'http://localhost:9000/resources' }],
			onListen(server) { server.log.info('thinks for you to use Better')}
		}),
		livereload('dist'), // 当dist目录中的文件发生变化时，刷新页面
		htmlTemplate({
			template: 'public/index.html',
			target: 'dist/index.html',
		}),
	],
	external: [
		{
			includeDependencies: true,
		},
	], // 项目中引用的第三方库
}
