const path = require('path');
const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')({
  pattern: '*'
});

const webpackConfig = require('./webpack.config');

gulp.task('scripts', () => {
  gulp.src(path.resolve(__dirname, './src/**/*js'))
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(path.resolve(__dirname, 'lib')));

  gulp.src(webpackConfig.entry)
      .pipe($.plumber())
      .pipe($.webpackStream(webpackConfig))
      .pipe($.plumber.stop())
      .pipe(gulp.dest(path.resolve(__dirname, 'dist')));
});

gulp.task('clean', (cb) => {
  del(['lib', 'dist'], cb);
});

gulp.task('build', ['clean'], () => gulp.start(['scripts']));
gulp.task('default', ['build']);
