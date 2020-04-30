const JwtStrategy = require( 'passport-jwt' ).Strategy
const mongoose = require( 'mongoose' );
const Container = require( "typedi" ).Container;

const strategy = () => {

  const opts = {}

  // Tell passport to read JWT from cookies
  opts.jwtFromRequest = function ( req ) {
    let token = null;
    if ( req && req.cookies ){
      token = req.cookies[ 'jwt' ]
    }
    return token
  }
  opts.secretOrKey = 'secret';
  // opts.issuer = 'accounts.examplesoft.com';
  // opts.audience = 'yoursite.net';

  return new JwtStrategy( opts, function ( jwt_payload, done ) {
    const logger  = Container.get( "logger" );
    const User = mongoose.model( 'User' );

    const { email } = jwt_payload.data;
    User.findOne( { email }, function ( err, user ) {
      if ( err ) {
        logger.error( 'JWT Strategy error:', err );

        return done( err, false );
      }
      if ( user ) {
        return done( null, user );
      } else {
        // If user does not exists, we deny access
        return done( null, false );
      }
    } );
  } )
}

module.exports = strategy();
