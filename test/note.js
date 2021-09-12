//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Note = require('../app/models/note.model.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Notes', () => {
    beforeEach((done) => {
        Note.remove({}, (err) => {
           done();
        });
    });

  describe('/GET notes', () => {
      it('it should GET all the notes', (done) => {
        chai.request(server)
            .get('/notes')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  describe('/POST notes', () => {
    it('it should POST a note', (done) => {
        let note = {
            title: "The Lord of the Rings",
            content: "J.R.R. Tolkien"
        }
      chai.request(server)
          .post('/notes')
          .send(note)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
          });
    });
  });

  describe('/GET/:id notes', () => {
    it('it should GET a note by the given id', (done) => {
        let note = new Note({ title: "The Lord of the Rings", content: "J.R.R. Tolkien" });
        note.save((err, note) => {
            chai.request(server)
          .get('/notes/' + note.id)
          .send(note)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('_id').eql(note.id);
            done();
          });
        });

    });
  });

  describe('/PUT/:id notes', () => {
     it('it should UPDATE a note given the id', (done) => {
         let note = new Note({title: "The Chronicles of Narnia", content: "C.S. Lewis"})
         note.save((err, note) => {
               chai.request(server)
               .put('/notes/' + note.id)
               .send({title: "The Chronicles of Narnia", content: "C.S."})
               .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                 done();
               });
         });
     });
  });

  describe('/DELETE/:id notes', () => {
    it('it should DELETE a note given the id', (done) => {
        let note = new Note({title: "The Chronicles of Narnia", content: "C.S. Lewis"})
        note.save((err, note) => {
              chai.request(server)
              .delete('/notes/' + note.id)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
              });
        });
    });
  });
});