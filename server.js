// ----- Load Node Modules -----

const http = require('http');
const request_handler = require('./requestHandler');

console.log("Imported Required Modules!")


// ----- Create Server Listener Function-----

const server = http.createServer((request, response) => {

    var url = request.url;

    if (url === "/") {
        
        response = request_handler.homepage(response);
        response.end();

        console.log("Served Response; Code 200");

    }

    else {
        
        response = request_handler.code_404(response);
        response.end();

        console.log("Served Response; Code 404");

    }
});


// ----- Initiate Server -----

const port = 3000;
server.listen(port);

console.log("Web Server Listening On Port " + port + "..");