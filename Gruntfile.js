/*
 * Code licensed under the MIT License:
 * https://github.com/abricos/abricos.js/blob/master/LICENSE
 *
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

var path = require('path');

// -- Globals ------------------------------------------------------------------
var ROOT = process.cwd();

// -- Config -------------------------------------------------------------------
module.exports = function(grunt) {
	grunt.initConfig({

		jshint: {
		    options: {
		        jshintrc: '.jshintrc'
		    },
		    files: 'src/**/*.js'
		},
		
        concat: {
            main: {
                src: [
                    'src/abricos.js'
                ],
                dest: 'build/src/abricos.js'
            }
        },
        
        uglify: {
            main: {
                files: {
                    // Результат задачи concat
                    'build/abricos-min.js': '<%= concat.main.dest %>'
                }
            }
        }
    });
	
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('default', ['concat', 'uglify']);
    
};