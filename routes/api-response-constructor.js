
module.exports = function(data, message, err) {
  this.status = data ? "success" : "failure";
  this.message = message;
  this.data = data ? data.constructor === Array ? data : [ data ] : null;
  this.err = err ? data.constructor === Array ? err : [ err ] : null;
}
