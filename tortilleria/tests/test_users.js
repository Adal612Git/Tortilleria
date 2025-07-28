jest.setTimeout(10000);
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/index');
const db = require('../src/infrastructure/db/database');

let token;
let createdId;

describe('Auth and Users API', () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash("aaaa", 8);
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO Usuario(nombre, rol, correo, password) VALUES(?,?,?,?) ON CONFLICT(correo) DO UPDATE SET password=excluded.password", ["Owner", "Due\u00f1o", "owner@example.com", hash], function(err){
        if(err) return reject(err); resolve();
      });
    });
  });

  test('login', async () => {
    const res = await request(app).post('/auth/login').send({ correo: 'owner@example.com', password: 'aaaa' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('create user', async () => {
    const res = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send({ nombre: 'Test', rol: 'Despachador', correo: 'test@example.com', password: 'pass' });
    expect(res.statusCode).toBe(201);
    createdId = res.body.id_usuario;
  });

  test('list users', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('get user by id', async () => {
    const res = await request(app).get(`/users/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id_usuario).toBe(createdId);
  });

  test('update user', async () => {
    const res = await request(app).put(`/users/${createdId}`).set('Authorization', `Bearer ${token}`).send({ nombre: 'Test2', rol: 'Despachador', correo: 'test@example.com', password: 'pass', activo: true });
    expect(res.statusCode).toBe(200);
  });

  test('delete user', async () => {
    const res = await request(app).delete(`/users/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
