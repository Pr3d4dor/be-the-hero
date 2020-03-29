const connection = require('../src/database/connection');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../src/index');

chai.use(chaiHttp);

describe('API Routes', function () {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run();
    });

    afterEach(async () => {
        await connection.migrate.rollback();
    });

    describe('POST /sessions', function () {
        it('should return ONG id', function (done) {
            chai.request(server)
                .post('/sessions')
                .send({ id: 'a521001b' })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.name.should.equals('Example ONG');
                    done();
                });
        });
        it('should not return ONG id with invalid credential', function (done) {
            chai.request(server)
                .post('/sessions')
                .send({ id: 'abc' })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('GET /profile', function () {
        it('should return all incidents of a specific ONG', function (done) {
            chai.request(server)
                .get('/profile')
                .set('Authorization', 'a521001b')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.equal(20);

                    for (const item of res.body) {
                        item.should.have.property('title');
                        item.should.have.property('description');
                        item.should.have.property('value');
                        item.should.have.property('ong_id');
                    }

                    done();
                });
        });
        it('should thrown validation error with an invalid request', function (done) {
            chai.request(server)
                .get('/profile')
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.be.json;
                    done();
                });
        });
    });

    describe('GET /ongs', function () {
        it('should return all ONGs', function (done) {
            chai.request(server)
                .get('/ongs')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.equal(2);

                    for (const item of res.body) {
                        item.should.have.property('id');
                        item.should.have.property('name');
                        item.should.have.property('email');
                        item.should.have.property('whatsapp');
                        item.should.have.property('city');
                        item.should.have.property('uf');
                    }

                    done();
                });
        });
    });

    describe('POST /ongs', function () {
        it('should create an ONG and return the id', function (done) {
            chai.request(server)
                .post('/ongs')
                .send({
                    name: 'Example ONG 2',
                    email: 'ong2@ong.com',
                    whatsapp: '+5542000000000',
                    city: 'Guarapuava',
                    uf: 'PR',
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('id');
                    done();
                });
        });
        it('should thrown validation error with an invalid request', function (done) {
            chai.request(server)
                .post('/ongs')
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.be.json;
                    done();
                });
        });
    });

    describe('GET /incidents', function () {
        it('should return all incidents paginated', function (done) {
            chai.request(server)
                .get('/incidents')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.equal(5);

                    res.headers.should.have.property('x-total-count');
                    res.headers['x-total-count'].should.equal('25');

                    res.headers.should.have.property('x-page-size');
                    res.headers['x-page-size'].should.equal('5');

                    for (const item of res.body) {
                        item.should.have.property('title');
                        item.should.have.property('description');
                        item.should.have.property('value');
                        item.should.have.property('ong_id');
                    }

                    done();
                });
        });
        it('should thrown validation error with an invalid request', function (done) {
            chai.request(server)
                .get('/incidents?page=asf')
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.be.json;
                    done();
                });
        });
    });

    describe('POST /incidents', function () {
        it('should create an incident and return id', function (done) {
            chai.request(server)
                .post('/incidents')
                .set('Authorization', 'a521001b')
                .send({
                    title: `Test Incident`,
                    description: `Test Description`,
                    value: 500,
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('id');
                    done();
                });
        });
        it('should thrown validation error with an invalid request', function (done) {
            chai.request(server)
                .post('/incidents')
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.be.json;
                    done();
                });
        });
    });

    describe('DELETE /incidents', function () {
        it('should delete an incident', function (done) {
            chai.request(server)
                .delete('/incidents/1')
                .set('Authorization', 'a521001b')
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        });
        it('should not delete an incident that doest belong to a specific ong', function (done) {
            chai.request(server)
                .delete('/incidents/1')
                .set('Authorization', 'bcccccc')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should thrown validation error with an invalid request', function (done) {
            chai.request(server)
                .delete('/incidents/asdf')
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.be.json;
                    done();
                });
        });
    });
});
