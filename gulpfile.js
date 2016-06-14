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

var port = $.util.env.port || 1337;
var src = 'app';
var dist = 'dist';
var buildTaskPack = ['static', 'lib', 'html', 'styles', 'scripts'];

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

const notifyEnable = process.platform == 'darwin';

gulp.task('scripts', () => {
  return gulp.src(webpackConfig.entry)
    .pipe($.if(notifyEnable, $.plumber({errorHandler: $.notify.onError("Error: <%= error.message" +
      " %>")})))
    .pipe($.webpackStream(webpackConfig))
    .pipe(gulp.dest(path.resolve(__dirname, dist, 'js')))
    .pipe($.size({ title : 'js' }))
    .pipe($.size())
    .pipe($.connect.reload())
    .pipe($.if(notifyEnable, $.notify('Complete scripts')));
});

gulp.task('html', () => {
  return gulp.src(path.resolve(src, 'index.html'))
    .pipe(gulp.dest(path.resolve(__dirname, dist)))
    .pipe($.size({ title : 'html' }))
    .pipe($.connect.reload());
});

gulp.task('serve', () => {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35728
    }
  });
});

gulp.task('static', () => {
  return gulp.src('static/**/*')
    .pipe($.size({ title : 'static' }))
    .pipe(gulp.dest(dist));
});

gulp.task('lib', () => {
  gulp.src([
    'node_modules/bootstrap/dist/**/*',
    'node_modules/bootstrap-datepicker/dist/**/*'
  ])
    .pipe($.size({ title : 'lib:js/css folder structure' }))
    .pipe(gulp.dest(dist));
  gulp.src([
    'node_modules/jquery/dist/*',
    'node_modules/handlebars/dist/handlebars.min.js'
  ])
    .pipe($.size({ title : 'lib:flat folder structure' }))
    .pipe(gulp.dest(dist+'/js'));
});

gulp.task('styles', () => {
  gulp.src('sass/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(path.resolve(__dirname, dist, 'css')));
});

gulp.task('watch', () => {
  gulp.watch(src+'/index.html', ['html']);
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch([src+'/**/*.js', src+'/**/*.hbs'], ['scripts']);
});

gulp.task('clean', (cb) => {
  del([dist], cb);
});

gulp.task('default', ['clean'], () => gulp.start(_.concat(buildTaskPack, 'serve', 'watch')));
gulp.task('build', ['clean'], () => gulp.start(buildTaskPack));
