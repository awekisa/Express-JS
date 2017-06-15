var gulp = require('gulp')
var uglify = require('gulp-uglify')
var htmlmin = require('gulp-htmlmin')


gulp.task('minify-html', function () {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('minified-html'))
})

gulp.task('minify-js', function () {
  gulp.src(['*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('minified-js'))
})

gulp.task('default', function () {
  console.log('Gulp is running!')
})
