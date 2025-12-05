
const http = require('http');
const url = require('url'); 


function fetchUserData(userId, callback) {
    const apiUrl = `http://jsonplaceholder.typicode.com/users/${userId}`;
    http.get(apiUrl, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
            try {
                const userData = JSON.parse(data);
                const formattedData = {
                    id: userData.id,
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    city: userData.address?.city,
                    company: userData.company?.name
                };
                callback(null, formattedData);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', error => callback(error, null));
}

function fetchPostData(postId, callback) {
    const apiUrl = `http://jsonplaceholder.typicode.com/posts/${postId}`;
    http.get(apiUrl, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
            try {
                const postData = JSON.parse(data);
                const formattedData = {
                    id: postData.id,
                    userId: postData.userId,
                    title: postData.title,
                    body: postData.body
                };
                callback(null, formattedData);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', error => callback(error, null));
}

function fetchTodoData(todoId, callback) {
    const apiUrl = `http://jsonplaceholder.typicode.com/todos/${todoId}`;
    http.get(apiUrl, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
            try {
                const todoData = JSON.parse(data);
                const formattedData = {
                    id: todoData.id,
                    userId: todoData.userId,
                    title: todoData.title,
                    completed: todoData.completed
                };
                callback(null, formattedData);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', error => callback(error, null));
}


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true); 
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    
    if (pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Welcome to My Simple REST API</h1>
            <p>Available endpoints:</p>
            <ul>
                <li>GET /users?id=1</li>
                <li>GET /posts?id=1</li>
                <li>GET /todos?id=1</li>
            </ul>
        `);
    }

    
    else if (pathname === '/users' && req.method === 'GET') {
        const id = query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user id' }));
            return;
        }
        fetchUserData(id, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch user data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            }
        });
    }

    
    else if (pathname === '/posts' && req.method === 'GET') {
        const id = query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing post id' }));
            return;
        }
        fetchPostData(id, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch post data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            }
        });
    }

   
    else if (pathname === '/todos' && req.method === 'GET') {
        const id = query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing todo id' }));
            return;
        }
        fetchTodoData(id, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch todo data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            }
        });
    }

    
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Route not found',
            availableEndpoints: [
                '/users?id={userId}',
                '/posts?id={postId}',
                '/todos?id={todoId}'
            ]
        }));
    }
});


server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});