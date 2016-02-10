var through2 = require('through2'),
  gutil = require('gulp-util'),
  path = require('path'),
  PluginError = gutil.PluginError;

var mimes = {
  woff:  'application/font-woff',
  woff2: 'application/font-woff2',
  ttf:   'application/x-font-truetype',
  eot:   'application/vnd.ms-fontobject',
  otf:   'application/x-font-opentype',
  svg:   'image/svg+xml'
}

module.exports = function (custom) {
  var fonts = [],
    options = { name: 'font', style: 'normal', weight: 400, formats: ['woff', 'woff2'] },
    output = null;

  for(var attr in custom) { options[attr] = custom[attr] }

  function process(file) {
    var format = file.path.match(/\.(.+)$/)[1], mime = mimes[format];
    if(!mime) return;

    return {
      format: format,
      compile: function(name) {
        return 'url("data:' + mime + ';base64,' + file.contents.toString('base64') + '") format("' + this.format + '")'
      }
    }
  }

  var transform = function (file, encoding, cb) {
    if(file.isBuffer()) {
      var font = process(file);

      if(font && options.formats.indexOf(font.format) != -1) {
        fonts.push(font);

        if(!output) {
          output = new gutil.File({
            cwd:  file.cwd,
            base: file.base,
            path: path.join(file.base, options.name + '.css')
          });
        }
      }
    } else if(file.isStream()) {
      this.emit('error', new PluginError('gulp-inline-fonts',  'Streaming is not supported'));
    }

    cb();
  }

  var flush = function (cb) {
    // if there are no matched files
    if(!output) return cb();
    var content = '@font-face { ' +
      'font-family: "' + options.name + '"; ' +
      'font-style: ' + options.style + '; ' +
      'font-weight: ' + options.weight + '; ' +
      'src: local("' + options.name + '"), ' + fonts.map(function(f) { return f.compile(options.name) }).join(', ') + '; ' +
    '}';
    output.contents = new Buffer(content);
    this.push(output);

    cb();
  }

  return through2.obj({}, transform, flush);
};
