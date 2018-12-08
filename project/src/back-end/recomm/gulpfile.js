const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

gulp.task('start', () => {
  nodemon({
    script: './src/daemon',
    ext: 'js html'
  })
})

gulp.task('default', ['start'])
