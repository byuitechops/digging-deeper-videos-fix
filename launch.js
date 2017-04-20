var fs = require("fs");
var https = require("https");
var http = require("http");
var url = require("url");

var httpsPort = 8000;
var httpPort = 8080;

function processRequest(req, res) {
	 
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
	
    var request = url.parse(req.url).pathname;
	var query = url.parse(req.url).query;
	if(request === "/grab"){
		try{
			
		console.log("grabbing link");
		var http = require("follow-redirects").https;
		var data = "";
		var link = unescape(query.split("=")[1]);
		console.log(link);
		var grabber = 
		http.request(link, function(feedback){
			feedback.on("data", function(chunk){
				data += chunk;
			});
			
			feedback.on("end", function(){
				//console.log(data);
				res.writeHead(200);
				res.write(data);
				res.end();
			});
		});
		grabber.on("err", function(err){
			if(err) throw(err);
			res.writeHead(200);
			res.write("Failed to get the requested resource");
		})
		grabber.end();
		}catch(e){}
		return;
	}
    var reader = fs.createReadStream("." + request);
    reader.on("error", () => {
        res.writeHead(404);
        res.write("404:\nThe page you are looking for does not exist...\nSO GET LOST!\neven though you already are...");
        res.end();
    });
    reader.pipe(res);
    console.log(request);
}

var options ={
    key:fs.readFileSync("./keys/server.key"),
    cert:fs.readFileSync("./keys/server.crt")
}

https.createServer(options,processRequest).listen(httpsPort)
//http.createServer(processRequest).listen(httpPort);

console.log(`Launched HTTPS on port ${httpsPort}`);