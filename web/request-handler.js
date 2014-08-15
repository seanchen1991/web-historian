// var path = require('path');
var url = require('url');
var mysql = require('mysql2');
var crypto = require('cryptojs');
var _ = require('underscore');
var path = require('path');
var httpHelper = require('./http-helpers.js');
var archive = require(path.join(__dirname, '../helpers/archive-helpers.js'));

// require more modules/folders here!

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "web_historian"
});

var handleGet = function(req, res) {
  var parsedUrl = url.parse(req.url);
  console.log("pathname: " + parsedUrl.pathname);
  if (parsedUrl.pathname === '/') {
    httpHelper.serveAssets(res, archive.paths.siteAssets + 'index.html');
  } else if (_.contains(['/index.html', '/loading.html', '/styles.css'], parsedUrl.pathname)){
    httpHelper.serveAssets(res, archive.paths.siteAssets + parsedUrl.pathname);
  } else {
    var hash = crypto.Crypto.SHA1(parsedUrl.pathname.substr(1));
    var siteName = archive.paths.archivedSites + hash + '.html';
    httpHelper.serveAssets(res, siteName);
  }
};

var handlePost = function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    body = body.substr(4);
    body = decodeURIComponent(body);
    console.log("decoded URI: " + body);
    // check to see if we already have the requested static file archived
    // if so, serve it up
    var post = { url: body, downloaded: 'false' };
    connection.query('INSERT INTO Sites SET ?', post, function(error) {
      if (error) {
        res.writeHead(500, "Insert to database failed");
        res.end("Server Error");
      } else {
        res.writeHead(302, {'Location': 'loading.html'});
        res.end();
      }
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
