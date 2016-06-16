var path = require('path');
var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')({
  pattern: '*'
});

var webpackConfig = require('./webpack.config.js');

var src = 'app';
var dist = 'dist';
var buildTaskPack = ['scripts'];

const notifyEnable = process.platform == 'darwin';

gulp.task('scripts', () => {
  return gulp.src(webpackConfig.entry)
    .pipe($.if(notifyEnable, $.plumber({errorHandler: $.notify.onError("Error: <%= error.message" +
      " %>")})))
    .pipe($.webpackStream(webpackConfig))
    .pipe(gulp.dest(path.resolve(__dirname, dist)))
    .pipe($.size({ title : 'js' }))
    .pipe($.size())
    .pipe($.connect.reload())
    .pipe($.if(notifyEnable, $.notify('Complete scripts')));
});

gulp.task('watch', () => {
  gulp.watch([src+'/lib/*.js'], ['scripts']);
});

gulp.task('clean', (cb) => {
  del([dist], cb);
});

gulp.task('build', ['clean'], () => gulp.start(buildTaskPack));
