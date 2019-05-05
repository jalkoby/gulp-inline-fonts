# gulp-inline-fonts

[![Build Status](https://travis-ci.org/jalkoby/gulp-inline-fonts.svg?branch=master)](https://travis-ci.org/jalkoby/gulp-inline-fonts)
[![npm version](https://badge.fury.io/js/gulp-inline-fonts.svg)](https://badge.fury.io/js/gulp-inline-fonts)

The plug-in converts fonts into a standalone css file. The primary use-case is to make one file stylesheet when you have a custom fonts.

## Installation

Install package with NPM and add it to your development dependencies:

`npm i --save-dev gulp-inline-fonts`

## Examples of usage

### An icon font

Let's suppose you have a custom icon font inside `assets/fonts/icons/` directory and want to include it inline into the stylesheets. To do it just add the follow into `gulpfile.js`:
```js
  var gulp = require('gulp'),
    inlineFonts = require('gulp-inline-fonts');

  gulp.task('icons', function() {
    return gulp.src(['assets/fonts/icons/*'])
      .pipe(inlineFonts({ name: 'icons' }))
      .pipe(gulp.dest('dist/fonts/'));
  });
```
The plug-in will take supported formats(.woff & .woff2 by default), convert them into base64 and write into `dist/fonts/icons.css` next:

```css
  @font-face {
    font-family: "icons";
    font-style: normal;
    font-stretch: normal;
    font-weight: 400;
    font-display: auto;
    src: local("icons"), url("data:application/font-woff;base64,...") format("woff"),
      url("data:application/font-woff2;base64,...") format("woff2");
  }
```

### A custom type font

In contrast to the icon font example a custom type font frequently has a few weights and styles (normal, bold,
italic & etc) like below:

```bash
$: ls src/fonts/thesans
200.woff   # light
200-i.woff # italic light
400.woff   # normal
400-i.woff # italic
700.woff   # bold
700-i.woff # italic bold
```

To compile them into a single css file add this code:

```js
var gulp = require('gulp'),
  inline = require('gulp-inline-fonts'),
  concat = require('gulp-concat'),
  merge  = require('merge-stream');

gulp.task('fonts', function() {
  // create an accumulated stream
  var fontStream = merge();

  [200, 400, 700].forEach(function(weight) {
    // a regular version
    fontStream.add(gulp.src(`src/fonts/thesans/${weight}.woff`)
                    .pipe(inline({ name: 'thesans', weight: weight, formats: ['woff'] })));

    // an italic version
    fontStream.add(gulp.src(`src/fonts/thesans/${weight}-i.woff`)
                    .pipe(inline({ name: 'thesans', weight: weight, formats: ['woff'], style: 'italic' })));
  });

  return fontStream.pipe(concat('thesans.css')).pipe(gulp.dest('build'));
});
```

## Default options
```js
{
  name: 'font',
  style: 'normal',
  stretch: 'normal',
  weight: 400,
  display: 'auto',
  formats: ['woff', 'woff2'] // also supported: 'ttf', 'eot', 'otf', 'svg'
}
```

## Other solutions
- [gulp-cssfont64](https://github.com/247even/gulp-cssfont64/tree/master/test)
- [gulp-base64-webfont-css](https://github.com/ygoto3/gulp-base64-webfont-css)
