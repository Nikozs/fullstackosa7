const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const request = require('supertest');
const { app, server } = require('../index')
const api = supertest(app)

let token;

const usernm="kayttaja4";
const pw="salasana4";

describe("Testing user api", function () {

test('a valid user can be added ', async (done) => {

    const user = {
        username: usernm,
        name: usernm,
        isAdult: true,
        password: pw
      }
  
    await api
      .post('/api/users')
      .send(user)
      .expect(200)

      done();
});

});