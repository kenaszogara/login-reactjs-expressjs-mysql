const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');

const mysql = require('mysql');


// server the static files from the React app
app.use(express.static(path.join(__dirname, 'client/src')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// make mysql connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'user'
})

conn.connect((err) => {
  if (err) {
    return err;
  }
  console.log('*Connect to db successfully');
});

// api calls ... 
// req.params: /api/user/:username/:password
// req.query: /api/user?username=test&password=test
app.get('/api/user/:username/:password', (req, res) =>{
  const { username, password } = req.params;
  const queryString = 'SELECT * FROM accounts WHERE username=? AND pass=?';
  conn.query(queryString, [username, password], (err, rows, field) =>{
    if(rows.length > 0){
      res.json(rows[0])
      console.log('*query success')
    } else {
      res.json({ })
      console.log('**query failed')
    }
  })
});

app.get('/api/get_all_accounts', (req, res) =>{
  var SELECT_ALL_ACCOUNTS = 'SELECT * FROM accounts';
  conn.query(SELECT_ALL_ACCOUNTS, (err, results) =>{
    if(err) {
      return res.send(err)
    } else {
      return res.json({
        results
      })
    }
  });
});


app.post('/api/post/:username/:password/:email', (req, res) => {
  const { username, password, email } = req.params;
  const queryString = 'SELECT * FROM accounts WHERE username=? OR email=?';

  conn.query(queryString, [username, email], (err, rows, field) => {
    if (rows.length > 0) {
      res.json("username or email already exists");
      console.log("**username or email already exists**");
    } else {
      const INPUT_SIGNUP = 'INSERT INTO accounts (username, pass, email ) VALUES (? ,? ,?)';
      conn.query(INPUT_SIGNUP, [username, password, email], (err, results) => {
        console.log("successfully added 1 account");
        res.json("success");
      });
    }
  })
});

// port setup for webserver
const port = process.env.PORT || 5000;

const webserver = app.listen(port, () => {
  console.log('Node Web Server running on ' + port)
});