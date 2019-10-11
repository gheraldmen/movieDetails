var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

exports.jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://gheraldhee.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://movie-details/',
    issuer: 'https://gheraldhee.auth0.com/',
    algorithms: ['RS256']
});