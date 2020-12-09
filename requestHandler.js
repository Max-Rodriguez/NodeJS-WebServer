// Load Required Node Modules
const http = require('http');
const fs = require('fs');


// ----- HTML Resources Paths -----
const path = './html_pages/'

const path_home = path + 'home.html';
const path_404 = path + '404.html';


class RequestHandler {

    homepage(response){

        // Header
        response.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // Content
        const content = fs.readFileSync(path_home, 'utf8');
        response.write(content);

        return response

    }
    
    code_404(response) {
        
        // Header
        const code = 404;
        response.writeHead(code, { 'Content-Type': 'text/html' });

        // Content
        const content = fs.readFileSync(path_404, 'utf8');
        response.write(content);

        return response

    }

}

// Initialize handler class.
const request_handler = new(RequestHandler);


module.exports = request_handler;

console.log("Loaded request handler module!")