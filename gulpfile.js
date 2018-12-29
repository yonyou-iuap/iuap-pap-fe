var gulp = require('gulp');
var zip = require('gulp-zip');
var ftp = require('gulp-ftp');
var sftp = require('gulp-fez-sftp');
var process = require('child_process');
var fs = require('fs');

const PACKAGE_NAME = "allowances";
const PACKAGE_WAR_NAME = `${PACKAGE_NAME}.war`;

// maven 配置信息
const publishConfig = {
  command: "mvn",
  repositoryId: "iUAP-Snapshots",
  repositoryURL: "http://172.16.51.12:8081/nexus/content/repositories/iUAP-Snapshots",
  artifactId: PACKAGE_NAME,
  groupId: "com.yonyou.iuap.pap.allowances",
  version: "3.6.0-SNAPSHOT"
};

gulp.task("ftp", function () {
  return gulp.src('build/iuap-pap-training-fe/**').pipe(ftp({
    host: '172.20.53.202',
    port: 21,
    user: 'user',
    pass: '123qwe',
    remotePath: "/"
  }));
});

gulp.task("sftp", function () {
  return gulp.src('build/iuap-pap-training-fe/**').pipe(sftp({
    host: '172.20.52.215',
    user: 'root',
    pass: 'MHF7ekNbtJ',
    remotePath: "/data/iuap-pap-training-fe"
  }));
});

/**
 * 打包为war
 * @param  {[type]} "package" [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task("package", function () {
  return gulp.src('./build/allowances/**')
    .pipe(zip(PACKAGE_WAR_NAME))
    .pipe(gulp.dest('./'));

});

/**
 * install 到本地
 * @param  {[type]} "install" [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task("install", ["package"], function () {

  var targetPath = fs.realpathSync('.');
  const { command } = publishConfig;

  // 安装命令
  var installCommandStr = `${command} install:install-file -Dfile=${targetPath}/${PACKAGE_WAR_NAME} -DgroupId=com.yonyou.iuap.pap -DartifactId=react_example_fe -Dversion=3.6.0-SNAPSHOT -Dpackaging=war`;

  var installWarProcess = process.exec(installCommandStr, function (err, stdout, stderr) {
    if (err) {
      console.log('install war error:' + stderr);
    }
  });

  installWarProcess.stdout.on('data', function (data) {
    console.info(data);
  });
  installWarProcess.on('exit', function (data) {
    console.info('install war success');
  })

});

/**
 * 发布到maven仓库中
 * @param  {[type]} "deploy"    [description]
 * @param  {[type]} ["package"] [description]
 * @param  {[type]} function(   [description]
 * @return {[type]}             [description]
 */
gulp.task("deploy", ["install"], function () {
  var targetPath = fs.realpathSync('.');
  const { command, repositoryId, repositoryURL } = publishConfig;

  var publishCommandStr = `${command} deploy:deploy-file  -Dfile=${targetPath}/${PACKAGE_WAR_NAME} -DgroupId=com.yonyou.iuap.pap -DartifactId=react_example_fe -Dversion=3.6.0-SNAPSHOT -Dpackaging=war -DrepositoryId=${repositoryId} -Durl=${repositoryURL}`;

  console.info(publishCommandStr);

  var publishWarProcess = process.exec(publishCommandStr, function (err, stdout, stderr) {
    if (err) {
      console.log('publish war error:' + stderr);
    }
  });

  publishWarProcess.stdout.on('data', function (data) {
    console.info(data);
  });
  publishWarProcess.on('exit', function (data) {
    console.info('publish  war success');
  });

})


gulp.task('default', ['deploy']);
