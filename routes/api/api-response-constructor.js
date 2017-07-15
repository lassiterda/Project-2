
module.exports = function(data, message, err) {
  //indicates the status of the request with a 'success' or 'failure' string
  this.status = data 
    ? 'success' 
    : 'failure'

  //contains a message indicating the operation performed
  this.message = message

  //if request was successful, contains data for use by client.  Nested ternary also ensures that data is always an Array.
  this.data = data 
    ? data.constructor === Array 
      ? data 
      : [ data ] 
    : null

  //if request was unsuccessful, contains error object for use by client.  Nested ternary also ensures that data is always an Array.
  this.err = err 
    ? err.constructor === Array 
      ? err 
      : [ err ] 
    : null
}
