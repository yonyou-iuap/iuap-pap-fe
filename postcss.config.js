/**
 * postcss的插件配置
 */

module.exports = {
  plugins: [
    //自动补全浏览器不兼容前缀
    require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 10 Firefox versions', 'Safari >= 7', 'ie > 10'] }),
    //压缩合并去重
    require('cssnano')({
      "assets": "default"
    })
  ]
}
