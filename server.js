// ----- Node Module Imports -----

const http = require('http');
const url = require('url');
const fs = require('fs');


// ----- Default Server Variables -----

const prefix = "[Server]: ";
const homepage = "/home.html";
const page404 = "/404.html";
const port = 3000;


// ----- Utils -----

// Create A Time Stamp

function getTimeStamp() {

    const moment = new Date();
    const local_string = moment.toLocaleString();
    let timestamp = "[" + local_string + "] ";

    return timestamp

}

// Console Logging

const log_types = {

    "log": (ts, msg) => { console.log(ts + prefix + msg); },

    "warn": (ts, msg) => { console.warn(ts + "[WARN]: " + msg); },

    "error": (ts, msg) => { console.error(ts + "[ERROR]: " + msg); },

    "_error": (ts, type) => {

        console.error(ts + "[ERROR]: " + 
            "Utils Logger: Type '" + type + "' Invalid.");

    }

}

function serverLog(type, msg) {

    const timestamp = getTimeStamp();

    function type_not_found() {

        let err_f = types["_error"];
        
        err_f(timestamp, type);

    }

    const log_function = typeof log_types[type] !== "undefined" ? log_types[type] : type_not_found();

    log_function(timestamp, msg);

}


// ----- Constructing HTTP Server -----

serverLog("log", "Initializing HTTP Server ..")

const server = http.createServer( (req, res) => {

    // Parse URL Path Requested
    const path = url.parse(req.url, true);
    const url_string = path.pathname;


    req.on("data", (data) => {
        // Data Listener Required For Request End Listener.
    });

    req.on("end", () => {

        let request_path = "./domain" + url_string;
        
        let file_found = false;
        let content;

        try {

            content = fs.readFileSync(request_path, 'utf-8');
            file_found = true;

        }
        
        catch {

            // Redirecting Root Requests to Homepage, Invalid Requests to 404.

            if (request_path !== "./domain/") {

                res.writeHead(302, { "Location": "/404.html" });

                res.end(); // Send Response

                serverLog("log", "Code 302; Redirected Request to [ " + page404 + " ]; Requested URL [ " + url_string + " ]");

            } else {

                res.writeHead(302, { "Location": "/home.html" });

                res.end(); // Send Response

                serverLog("log", "Code 302; Redirected Request to [ " + homepage + " ]; Requested URL [ " + url_string + " ]");

            }

        }

        if (file_found) {

            res.writeHead(200, "OK", { "Content-Type": "text/html" });
            res.write(content);

            res.end(); // Send Response

            serverLog("log", "Code 200; Served Request for URL [ " + url_string + " ]")

        }

    });

});


// ----- Initialize Listening -----

try {

    server.listen(port, () => {

        serverLog("log", "Web Server Listening On Port (" + port + ") ..");
    
    });

}

catch (error) {
    
    serverLog("warn", "Failed to listen on port " + port + " ..");
    serverLog("error", error); // Log error message.

}