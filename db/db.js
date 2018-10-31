const { Client } = require('pg');

// instantiate client using your DB configurations
// const client = new Client({
//   database: 'd46tsp14hkrlur',
//   user: 'prifmxipdwnwbx',
//   password: '35b9bc58401ab3bfadcf724a9c0e770ce9d729a7ee2be896bee49338efe3b7be',
//   host: 'ec2-50-16-196-238.compute-1.amazonaws.com',
//   port: 5432,
//   ssl: true
// });

const client = new Client({
  database: 'dd3c9ddqhmqsf1',
  user: 'blyngucjcpjbdl',
  password: 'a3f53719e07cadeb9e08ed97af16fd1c4be426fac803b7214ae7633197223394',
  host: 'ec2-54-163-227-253.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});
client.connect().then(function () {
  console.log('connected to database from module!')
}).catch(function (err) {
  if (err) {}
  console.log('cannot connect to database!')
})


module.exports = {
  query: (text, callback) => {
    return client.query(text, callback)
  }
}
