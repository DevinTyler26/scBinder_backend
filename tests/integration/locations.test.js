const request = require('supertest');
const {Location} = require('../../models/location');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/locations', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Location.remove({});
  });

  describe('GET /', () => {
    it('should return all locations', async () => {
      const locations = [
        { name: 'location1' },
        { name: 'location2' },
      ];
      
      await Location.collection.insertMany(locations);

      const res = await request(server).get('/api/locations');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'location1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'location2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a location if valid id is passed', async () => {
      const location = new Location({ name: 'location1' });
      await location.save();

      const res = await request(server).get('/api/locations/' + location._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', location.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/locations/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no location with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/locations/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/locations')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();      
      name = 'location1'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if location is less than 5 characters', async () => {
      name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if location is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the location if it is valid', async () => {
      await exec();

      const location = await Location.find({ name: 'location1' });

      expect(location).not.toBeNull();
    });

    it('should return the location if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'location1');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let location; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/locations/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
      // Before each test we need to create a location and 
      // put it in the database.      
      location = new Location({ name: 'location1' });
      await location.save();
      
      token = new User().generateAuthToken();     
      id = location._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if location is less than 5 characters', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if location is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if location with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the location if input is valid', async () => {
      await exec();

      const updatedLocation = await Location.findById(location._id);

      expect(updatedLocation.name).toBe(newName);
    });

    it('should return the updated location if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let location; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/locations/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a location and 
      // put it in the database.      
      location = new Location({ name: 'location1' });
      await location.save();
      
      id = location._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no location with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the location if input is valid', async () => {
      await exec();

      const locationInDb = await Location.findById(id);

      expect(locationInDb).toBeNull();
    });

    it('should return the removed location', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', location._id.toHexString());
      expect(res.body).toHaveProperty('name', location.name);
    });
  });  
});