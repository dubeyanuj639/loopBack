'use strict';

module.exports = function enableAuthentication(server) {
  // enable authentication
  console.log("middleware ===>>")
  server.enableAuth();
};
