/*
 * grunt-simple-dox
 * https://github.com/Couto/grunt-simple-dox
 *
 * Copyright (c) 2013 Luis Couto
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('simple_dox', 'Simply run dox to generate the json files', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({ separator: grunt.util.linefeed }),
        dox = require('dox'),
        util = require('util'),
        done = this.async(),
        doc = function (file) {
          var buf = grunt.file.read(file),
              obj = dox.parseComments(buf, {
                raw: options.raw || options.api
              });

          if (options.debug) {
            return grunt.log.debug(util.inspect(obj, false, Infinity, true) + '\n');
          }

          if (options.api) { return dox.api(obj); }

          return JSON.stringify(obj, null, 4);
        };

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
      // Concat specified files.
      var src = file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(doc).join(grunt.util.normalizelf(options.separator));

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');

    });
  });
};
