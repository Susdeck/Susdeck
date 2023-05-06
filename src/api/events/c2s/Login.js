const settings = require('../../../../Settings');

const Event = require('../Event');

const ev = new Event('c2sr_login', (socket, args, loginList) => {
  const sid = args[0];
  if (!settings.UseAuthentication) { socket.emit('session_valid'); return; }
  // ID recieved, load into memory so we know it's the same user logging in.
  loginList.push(sid);
  socket.sid = sid;

  // We'll confirm that we want to take user to the login page.
  socket.emit('s2ca_login', 'assets/tools/login.html', settings.LoginMessage, settings.YourName);
  return 'User ' + sid + ' requested login!';
});

module.exports = ev;
