import compose from 'lodash/fp/compose';
import path from 'path';
import {DefinePlugin} from 'webpack';
import babel from 'webpack-config-babel';

const context = __dirname;

export default compose(
  babel()
)({
  target: 'web',
  context,
  entry: './index.js',
  output: {
    filename: 'web.js',
    path: path.join(context, 'dist'),
    publicPath: '/',
  },
  serve: context,
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
});
