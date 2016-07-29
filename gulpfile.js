var path = require('path');
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')({
  pattern: '*'
});

gulp.task('scripts', () => {
  return gulp.src(path.resolve(__dirname, './src/**/*js'))
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(path.resolve(__dirname, 'lib')));
});

gulp.task('clean', (cb) => {
  del(['lib'], cb);
});

gulp.task('build', ['clean'], () => gulp.start(['scripts']));
