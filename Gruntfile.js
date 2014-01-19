var path = require('path');

// -- Config -------------------------------------------------------------------
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('bower.json'),
        clean: {
            build: ['build/'],
            release: ['release/<%= pkg.version %>/']
        },
        concat: {
            main: {
                src: [
                    'src/abricos.js'
                ],
                dest: 'build/abricos.js'
            }
        },
        copy: {
            main: {
                src: [
                    '{LICENSE,README.md}'
                ],
                dest: 'build/'
            }
        },
        compress: {
            release: {
                options: {
                    archive: 'release/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                expand: true,
                flatten: true,
                dest: '<%= pkg.name %>/',
                src: [
                    '{bower.json,LICENSE.md,README.md}',
                    'build/*'
                ]
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            main: {
                files: {
                    'build/abricos-min.js': '<%= concat.main.dest %>'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean:build', 'concat', 'uglify']);
    grunt.registerTask('release', ['default', 'clean:release', 'compress:release']);

};