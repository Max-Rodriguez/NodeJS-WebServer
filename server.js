// ----- Load Node Modules -----

const http = require('http');
const request_handler = require('./requestHandler');

console.log("Imported Required Modules!")


// ----- Create Server Listener Function-----

const server = http.createServer((request, response) => {

    var url = request.url;

    if (url === "/") {

        const http_code = 200;
        
        response = request_handler.homepage(response, http_code);
        response.end();

        console.log("Served Response; Code " + http_code);

    }

    else {
        
        const http_code = 404;
        
        response = request_handler.code_404(response);
        response.end();

        console.log("Served Response; Code " + http_code);

    }
});


// ----- Initiate Server -----

const port = 3000;
server.listen(port);

console.log("Web Server Listening On Port " + port + "..");