// ----- Node Module Imports ----- //

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { read } = require('fs/promises');


// ----- Default Server Variables ----- //

let homepage = "/home.html";
let page404 = "/404.html";
let port = 3000;


// ----- Parsing JSON Configuration ----- //

try {
    var json_config = fs.readFileSync("./configuration.json", 'utf-8');
} catch (error) {
    console.error("[ERROR]: Configuration JSON could not be read.");
    console.error(error);
}

try {
    var config = JSON.parse(json_config);
} catch (error) {
    console.error("[ERROR]: Could not parse JSON Configuration String.");
    console.error(error);
}


// Load Port Variable
try { port = config.default_port; 
    console.log("[Initialization]: Listening Port: " + port);} 
    
    catch { console.warn("[WARN]: No Default Port Set in configuration.json!"); }


// Load Homepage Path Variable
try { homepage = config.root_page; 
    console.log("[Initialization]: Root Page Path: " + homepage);} 

    catch { console.warn("[WARN]: No Homepage Path Set in configuration.json!"); }


// Load 404 Path Variable
try { page404 = config.not_found_404; 
    console.log("[Initialization]: Page 404 Path: " + page404);} 

    catch { console.warn("[WARN]: No 404 Page Path Set in configuration.json!"); }


// ----- Utils ----- //

// Create A Time Stamp

function getTimeStamp() {

    const moment = new Date();
    const local_string = moment.toLocaleString();
    let timestamp = "[" + local_string + "] ";

    return timestamp

}

// Console Logging

const log_types = {

    "log": (ts, msg) => { console.log(ts + "[Server]: " + msg); },

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

// Return Response Content Type By File Extension

function return_content_type(filepath) {

    const file_extension = path.extname(filepath).toLowerCase(); // Get extension.

    switch(file_extension) {

        // Content Types by Extension Cases

        // Text
        case '.html': return "text/html";
        case '.htm': return "text/html";
        case '.css': return "text/css";
        case '.txt': return "text/plain";

        // Application
        case '.js': return "application/javascript";

        // Images
        case '.ico': return "image/x-icon";
        case '.png': return "image/png";
        case '.jpeg': return "image/jpeg";
        case '.jpg': return "image/jpeg";
        case '.bmp': return "image/bmp";
        case '.gif': return "image/gif";

        // Fonts
        case '.ttf': return "font/ttf";
        case '.otf': return "font/otf";
        case '.sfnt': return "font/sfnt";
        case '.woff': return "font/woff";
        case '.woff2': return "font/woff2";

        // Unrecognized Extension
        default:
            return "text/plain";

    }

}

// Return Transfer Type
function return_transfer_type(str_type) {

    let type_prefix = str_type.substr(0, 5);

    switch (type_prefix) {

        case "font/": return "binary";
        case "image": return "binary";

        case "text/": return "utf8";
        case "appli": return "utf8";

        default: return "binary";

    }

}

// ----- Constructing HTTP Server ----- //

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

        function serve_request(target) {

            let content_type = return_content_type(target)

            let read_type = return_transfer_type(content_type);

            let chunked = [];

            read_stream = fs.createReadStream(target, read_type);

            // On Data Stream, Add Chunk
            read_stream.on("data", (chunk) => {

                chunked.push(chunk); // Add buffer to chunked.

            });

            read_stream.on("end", () => {

                let content_type = return_content_type(target)

                let transfer_type = return_transfer_type(content_type);

                res.writeHead(200, "OK", { "Content-Type": content_type });

                let content = chunked.join(''); // Join all buffers into 1 string with no spaces.

                res.write(content, transfer_type);
    
                res.end(); // Send Response
    
                serverLog("log", "Code 200; Served Request for URL [ " + url_string + " ]")

            })

        }

        function redirect_request(target) {

            res.writeHead(302, { "Location": target });

            res.end(); // Send Response

            serverLog("log", "Code 302; Redirected Request to [ " + target + " ]; Requested URL [ " + url_string + " ]");

        }

        // ----- Routing Requests ----- //

        if (request_path == "./domain/") {

            redirect_request(homepage);

        } else {

            // Validate Requested URL Path

            if ( fs.existsSync(request_path) ) {

                serve_request(request_path);

            } else {

                redirect_request(page404);

            }

        }


    });

});


// ----- Initialize Listening ----- //

try {

    server.listen(port, () => {

        serverLog("log", "Web Server Listening On Port (" + port + ") ..");
    
    });

}

catch (error) {
    
    serverLog("warn", "Failed to listen on port " + port + " ..");
    serverLog("error", error); // Log error message.

}