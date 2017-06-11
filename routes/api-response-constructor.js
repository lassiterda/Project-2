
module.exports = function(data, message, err) {
  this.status = data ? "success" : "failure";
  this.message = message;
  this.data = data.constructor === Array ? data : [ data ];
  this.err = err.constructor === Array ? err : [ err ];
}
