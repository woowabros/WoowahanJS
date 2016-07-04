var path = require('path');
var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')({
  pattern: '*'
});

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var dist = 'dist';
var buildTaskPack = ['lib', 'html', 'scripts'];

const notifyEnable = process.platform == 'darwin';

gulp.task('scripts', () => {
  return gulp.src(webpackConfig.entry)
    .pipe($.if(notifyEnable, $.plumber({errorHandler: $.notify.onError("Error: <%= error.message" +
      " %>")})))
    .pipe($.webpackStream(webpackConfig))
    .pipe(gulp.dest(path.resolve(__dirname, dist, 'js')))
    .pipe($.size({ title : 'js' }))
    .pipe($.size())
    .pipe($.if(notifyEnable, $.notify('Complete scripts')));
});

gulp.task('html', () => {
  return gulp.src(path.resolve('./', 'index.html'))
    .pipe(gulp.dest(path.resolve(__dirname, dist)))
    .pipe($.size({ title : 'html' }));
});

gulp.task('lib', () => {
  gulp.src([
    'node_modules/todomvc-app-css/*.css',
    'node_modules/todomvc-common/*.css'
  ])
    .pipe($.size({ title : 'lib:flat folder structure' }))
    .pipe(gulp.dest(dist+'/css'));
});

gulp.task('clean', (cb) => {
  del([dist], cb);
});

gulp.task('default', ['build']);
gulp.task('build', ['clean'], () => gulp.start(buildTaskPack));
