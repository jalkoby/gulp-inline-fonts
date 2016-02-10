# gulp-inline-fonts

[![Build Status](https://travis-ci.org/jalkoby/gulp-inline-fonts.svg?branch=master)](https://travis-ci.org/jalkoby/gulp-inline-fonts)

The plug-in converts fonts into a standalone css file. The primary use-case is to make one file stylesheet when you have a custom fonts.

## Installation

Install package with NPM and add it to your development dependencies:

`npm i --save-dev gulp-inline-fonts`

## Basic usage

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
    font-weight: 400;
    src: local("icons"), url("data:application/font-woff;base64,...") format("woff"),
      url("data:application/font-woff2;base64,...") format("woff2");
  }
```

## Default options
```js
{
  name: 'font',
  style: 'normal',
  weight: 400,
  formats: ['woff', 'woff2'] // also supported: 'ttf', 'eot', 'otf', 'svg'
}
```

## Other solutions
- [gulp-cssfont64](https://github.com/247even/gulp-cssfont64/tree/master/test)
- [gulp-base64-webfont-css](https://github.com/ygoto3/gulp-base64-webfont-css)
