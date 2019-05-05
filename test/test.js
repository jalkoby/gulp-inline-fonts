var assert = require('stream-assert'),
    should = require('should'),
    path   = require('path'),
    gulp   = require('gulp'),
    plugin = require('../index');

var fixtures = function(glob) { return path.join(__dirname, 'fixtures', glob); }
var is_equal = function(name, parts) {
  var content = parts.join('');
  return assert.first(function(d) {
    d.path.should.eql(path.join(d.base, '/' + name + '.css'));
    d.contents.toString().should.eql(content);
  });
}

describe('gulp-inline-fonts', function() {
  describe('in buffer mode', function() {
    it('does not require any options', function(done) {
      gulp.src(fixtures('simple/*'))
        .pipe(plugin())
        .pipe(assert.length(1))
        .pipe(is_equal('font', [
          '@font-face { font-family: "font"; font-style: normal; font-stretch: normal; font-weight: 400; font-display: auto; ',
          'src: local("font"), url("data:font/woff;base64,") format("woff"), ',
            'url("data:font/woff2;base64,") format("woff2"); }'
        ]))
        .pipe(assert.end(done));
    });

    it('allows to specify a custom options', function(done) {
      gulp.src(fixtures('simple/myfont.*'))
        .pipe(plugin({ formats: ['ttf', 'otf'], name: 'myfont', weight: 200, style: 'italic', display: 'fallback' }))
        .pipe(assert.length(1))
        .pipe(is_equal('myfont', [
          '@font-face { font-family: "myfont"; font-style: italic; font-stretch: normal; font-weight: 200; font-display: fallback; ',
          'src: url("data:font/otf;base64,"); ',
          'src: local("myfont"), url("data:font/ttf;base64,") format("truetype"); }'
        ]))
        .pipe(assert.end(done));
    });
  });
});
