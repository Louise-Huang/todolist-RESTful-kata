function errorHandle (res, errorStatusCode, errorMessage) {
  const headers = {
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
	}
  res.writeHead(errorStatusCode, headers)
  res.write(JSON.stringify({
    "status": "failed",
    "message": errorMessage
  }))
  res.end()
}
module.exports = errorHandle