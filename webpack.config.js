const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
entry: {
app: path.resolve(__dirname, 'src', 'index.js'), // El js base del proyecto
},
devtool: 'inline-source-map',
output: {
path: path.resolve(__dirname, 'build'), // Directorio en el que se va a poner el bundle
filename: '[name].js'
},
devServer: {
contentBase: path.join(__dirname, 'build'), // Directorio virtual desde donde se hostea
port: 8080,
},
module: {
rules: [ // Se establecen reglas de cómo procesar archivos que no sean .js
{
test: /\.css$/,
use: [
{
loader: MiniCssExtractPlugin.loader,
options: {
publicPath: '../',
hmr: process.env.NODE_ENV === 'development',
},
},
'css-loader',
],
},
]
},
plugins: [ // Se añaden configuraciones específicas de plugins
new HtmlWebpackPlugin({
template: './src/index.html'
}),
new MiniCssExtractPlugin({
filename: '[name].css',
chunkFilename: '[id].css',
}),
]
}