const http = require('http')
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle')

const todos = []
const requestListener = (req, res) => {
  const headers = {
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
	}

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      "status": "success",
      "data": todos
    }))
    res.end()
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if (title !== undefined) {
          const todo = {
            id: uuidv4(),
            title
          }
          todos.push(todo)
          res.writeHead(201, headers)
          res.write(JSON.stringify({
            "status": "success",
            "data": todo
          }))
          res.end()
        } else {
          errorHandle(res, 400, "wrong data format")
        }
      } catch (err) {
        console.log('程式錯誤', err)
        errorHandle(res, 400, "wrong data format")
      }
    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      "status": "success",
      "data": todos
    }))
    res.end()
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2]
    const index = todos.findIndex(item => item.id === id)
    if (index !== -1) {
      todos.splice(index, 1)
      res.writeHead(204, headers)
      res.end()
    } else {
      errorHandle(res, 400, "id is not exist")
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    const id = req.url.split('/')[2]
    const index = todos.findIndex(item => item.id === id)
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if (title !== undefined && index !== -1) {
          todos[index].title = title
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            "status": "success",
            "data": todos[index]
          }))
          res.end()
        } else {
          errorHandle(res, 400, "wrong data format")
        }
      } catch (err) {
        console.log('程式錯誤', err)
        errorHandle(res, 400, err)
      }
    })
  } else {
    errorHandle(res, 404, "Page Not Found")
  }
}
const server = http.createServer(requestListener)
server.listen(process.env.PORT || 8001)