var path = require('path');
var fs = require('fs');
var archive = require(path.join(__dirname, '../helpers/archive-helpers.js'));

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from
  // others...), css, or anything that doesn't change often.)
  var ext = asset.substr(asset.lastIndexOf('.')+1);
  console.log('Serving up asset: ' + asset);
  var contentType = 'text/html';
  switch (ext) {
    case 'html' : contentType = 'text/html';              break;
    case 'css' :  contentType = 'text/css';               break;
    case 'js':    contentType = 'application/javascript'; break;
    default:      contentType = 'text/plain';             break;
  }

  fs.exists(asset, function(exists) {
    if (exists) {

      fs.readFile(asset, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end("Server Error");
        }
        else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });

    } else {
      res.writeHead(404);
      res.end("File Not Found");
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!
