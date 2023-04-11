const ex = require('express')
const path = require('path')
const httpLib = require('http')
const app = ex()
const http = new httpLib.Server(app)
const debug = require('./cliUtil')
const io = require('socket.io')(http);
const sock_api_init = require('./api/init');

const port = process.env.PORT || 3000
const getNetworkInterfaces = require('./network')

sock_api_init(io); // Socket API initialize

app.use('/', ex.static('./src/app'))

app.get('/sounds.js', (e, r) => { r.sendFile(path.join(__dirname, '\\sounds.js')) })
app.get('/soundboard.js', (e, r) => { r.sendFile(path.join(__dirname, '\\soundboard.js')) })
app.get('/api/dbg', (e, r) => { r.send({ status: debug.is }) })

http.listen(port, function () {
  console.log('Susdeck is started!')
  if (process.argv[2] !== '-nocompanion') { console.log('Susdeck Host is running - starting Companion'); require('child_process').exec('npx electron src/companion') }
  if (getNetworkInterfaces().Ethernet) { console.log('Go to ' + getNetworkInterfaces().Ethernet[0] + ':3000 on your mobile device ') }
  if (getNetworkInterfaces()['Wi-Fi']) { console.log('Go to ' + getNetworkInterfaces()['Wi-Fi'][0] + ':3000 on your mobile device ') }
})
