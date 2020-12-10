// ----- Load Node Modules ----- //

const http = require('http');
const url = require('url');
const ResourceHandler = require('./resourceHandler');

console.log("Imported Required Modules!")


// ----- Create Server Listener Function----- //

const server = http.createServer((request, response) => {

    // Request Variables
    const req_url = url.parse(request.url, true);
    const req_headers = request.headers;
    const req_query = req_url.query;
    const req_method = request.method.toLowerCase();

    // Preparing URL Parsed
    let path = req_url.pathname;
    path = path.replace(/^\/+|\/+$/g, ""); // Removing '/' if at end of URL.

    // ----- Routing Requests ----- //

    request.on("data", () => {

        console.log("Additional Data Received From Request..")
        // This listener is needed for "end" listener to work.

    })

    request.on("end", () => {

        let route_function = typeof routes[path] !== "undefined" ? routes[path] : routes["___404___"];
        // Search for path on routes dictionary, else get 404 function.

        let data = {

            path: path,
            queryString: req_query,
            headers: req_headers,
            method: req_method

        }

        route_function(data, response);

        console.log("Served Response for route [ /" + path + " ]")

    })

});

// ----- Routing List ----- //

const routes = {

    "": (data, response) => {

        response = ResourceHandler.homepage(response);
        response.end();

    },

    "___404___": (data, response) => {

        response = ResourceHandler.code_404(response);
        response.end();

    }

}


// ----- Initiate Server ----- //

const port = 3000;

server.listen(port, () => {
    console.log("Web Server Listening On Port " + port + "..");
});