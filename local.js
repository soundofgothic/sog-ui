// generated by @ng-toolkit/universal
    const port = process.env.PORT || 8080;
    
    const server = require('./dist/server');
    
    server.app.listen(port, "127.0.0.1", () => {
        console.log("Listening on: http://localhost:" + port );
    });
    
