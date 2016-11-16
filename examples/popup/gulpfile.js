var path = require('path');
var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')({
  pattern: '*'
});

var webpackConfig = require('./webpack.config.js');

gulp.task('scripts', () => {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpackStream(webpackConfig))
    .pipe(gulp.dest(path.resolve(__dirname, 'dist', 'js')))
    .pipe($.size({ title : 'js' }))
    .pipe($.size());
});

gulp.task('html', () => {
  return gulp.src(path.resolve(__dirname, 'index.html'))
    .pipe(gulp.dest(path.resolve(__dirname, 'dist')))
    .pipe($.size({ title : 'html' }));
});

gulp.task('clean', (cb) => {
  del(['dist'], cb);
});

// TODO: style을 Woowahan 내재화
gulp.task('styles', () => {
  gulp.src('scss/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(path.resolve(__dirname, 'dist', 'css')));
});

gulp.task('default', ['clean'], () => gulp.start('build'));
gulp.task('build', ['clean'], () => gulp.start(['scripts', 'styles', 'html']));
