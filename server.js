// ----- Load Node Modules -----
const http = require('http');
const fs = require('fs');


// ----- HTML Resources Paths -----
const path = './html_pages/'

const path_home = path + 'home.html';
const path_404 = path + '404.html';


// ----- Create Server Listener Function-----
const server = http.createServer((request, response) => {
    var url = request.url;

    if (url === "/") {
        // Set Response Header
        const code = 200;
        response.writeHead(code, { 'Content-Type': 'text/html' }); 
        
        // Send Response Content
        const content = fs.readFileSync(path_home, 'utf8');
        response.write(content);

        response.end();

        console.log("Served response; Code " + code);
    }

    else {
        // No correct path, return code 404 header.
        const code = 404;
        response.writeHead(code, { 'Content-Type': 'text/html' });

        const content = fs.readFileSync(path_404, 'utf8');
        response.write(content);

        response.end();

        console.log("Served response; Code " + code);
    }
});


// ----- Initiate Server -----
const port = 3000;
server.listen(port);

console.log("Web Server Listening On Port " + port + "..");