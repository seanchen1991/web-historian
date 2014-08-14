// var path = require('path');
var fs = require('fs');
var url = require('url');
var crypto = require('cryptojs');
var httpHelper = require('./http-helpers.js');
var _ = require('underscore');
var path = require('path');
var archive = require(path.join(__dirname, '../helpers/archive-helpers.js'));

// require more modules/folders here!


var handleGet = function(req, res) {
  var parsedUrl = url.parse(req.url);
  console.log("pathname: " + parsedUrl.pathname);
  if (parsedUrl.pathname === '/') {
    httpHelper.serveAssets(res, archive.paths.siteAssets + 'index.html');
  } else if (_.contains(['/index.html', '/loading.html', '/styles.css'], parsedUrl.pathname)){
    httpHelper.serveAssets(res, archive.paths.siteAssets + parsedUrl.pathname);
  } else {
    var hash = crypto.Crypto.SHA1(parsedUrl.pathname.substr(1));
    httpHelper.serveAssets(res, archive.paths.archivedSites + hash);
  }
};

var handlePost = function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    body = body.substr(4);
    // check to see if we already have the requested static file archived
    // if so, serve it up
    fs.appendFile(archive.paths.list, body + '\n', function(error) {
      if (error) {
        res.writeHead(500, 'Append to site.txt failed');
      } else {
        res.writeHead(302, {'Location': 'loading.html'});
      }
      res.end();
    });
  });
};

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    handleGet(req, res);
  } else if (req.method === 'POST') {
    handlePost(req, res);
  }
};
