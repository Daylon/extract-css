/* eslint-disable */

'use strict';

var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    extractCss = require('../index');

function getFile(filePath) {
    return new gutil.File({
        path: path.resolve(filePath),
        cwd: './test/',
        base: path.dirname(filePath),
        contents: new Buffer(String(fs.readFileSync(filePath)))
    });
}

function compare(fixturePath, expectedHTML, expectedCSS, options, done) {
    var file = getFile(fixturePath);

    options.url = 'file://' + file.path;

    extractCss(file.contents.toString('utf8'), options, function (err, html, css) {
        html.should.be.equal(String(fs.readFileSync(expectedHTML)));
        css.should.be.equal(String(fs.readFileSync(expectedCSS)));

        done();
    });
}

describe('extract-css', function() {
    it('Should separate css and html', function(done) {
        var options = {
            applyStyleTags: true,
            removeStyleTags: true,
            applyLinkTags: true,
            removeLinkTags: true,
            preserveMediaQueries: false
        };
        compare(path.join('test', 'fixtures', 'in.html'), path.join('test', 'expected', 'out.html'), path.join('test', 'expected', 'file.css'), options, done);
    });

    it('Should handle malformed CSS', function(done) {
        var options = {
            applyStyleTags: true,
            removeStyleTags: true,
            applyLinkTags: true,
            removeLinkTags: true,
            preserveMediaQueries: false
        };
        compare(path.join('test', 'fixtures', 'malformed.html'), path.join('test', 'expected', 'malformed.html'), path.join('test', 'expected', 'malformed.css'), options, done);
    });

    it('Should be able request both local and remote stylesheets', function(done) {
        var options = {
            applyStyleTags: true,
            removeStyleTags: true,
            applyLinkTags: true,
            removeLinkTags: true,
            preserveMediaQueries: false
        };
        compare(path.join('test', 'fixtures', 'with-remote.html'), path.join('test', 'expected', 'out-plus-remote.html'), path.join('test', 'expected', 'file-plus-remote.css'), options, done);
    });

    it('Should be able to skip remote stylesheets', function(done) {
        var options = {
            applyStyleTags: true,
            skipRemoteStylesheets: true,
            removeStyleTags: true,
            applyLinkTags: true,
            removeLinkTags: true,
            preserveMediaQueries: false
        };
        compare(path.join('test', 'fixtures', 'with-remote.html'), path.join('test', 'expected', 'out-plus-remote.html'), path.join('test', 'expected', 'file.css'), options, done);
    });
});
