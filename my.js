const cookie = require('cookie');
const http = require('http');
const escapeHtml = require('escape-html');
const url = require('url');
const qs = require("qs");
const port = 8081;

const server = http.createServer((req, res)=>{

    let query = url.parse(req.url).query;
    query = qs.parse(query)


    if(query && query.name && query.remember){
        res.setHeader('Set-Cookie',cookie.serialize('name',String(query.name),{
            httpOnly : true,
            maxAge : 60*60*24*7
        }));
        res.statusCode=302;
        res.setHeader('location', req.headers.referer || '/');
        res.end();
        return;
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    // res.writeHead(200,{'Content-type':'text/html'});
    let name  = cookies.name;
    if (name) {
        res.write('<p>Welcome back, <b>' + escapeHtml(name) + '</b>!</p>');
    } else {
        res.write('<p>Hello, new visitor!</p>');
    }

    res.write('<form method="GET">');
    res.write('<input placeholder="enter your name" name="name"> <input type="submit" value="Set Name">');
    res.write('<input type="checkbox" id="remember" name="remember" value="true">\n' +
        '<label for="vehicle2"> Remember me</label><br>');
    res.end('</form>');

});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})