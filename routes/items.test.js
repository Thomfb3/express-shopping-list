process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let tomatoes = { name: "Tomatoes", price: "6.99" };

beforeEach(function() {
  items.push(tomatoes);
});

afterEach(function() {
  items.length = 0;
});
// end afterEach


/////GET /all items 
describe("GET /items", function() {
  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({items: [tomatoes]});
  });
});
// end

/////GET /item by name
describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${tomatoes.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({item: tomatoes});
  });

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/////POST /new item 
describe("POST /items", function() {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "Mozzarella",
        price: "5.00"
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      item: { name: "Mozzarella", price: "5.00" }
    });
  });
});
// end

/////PATCH /update item 
describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${tomatoes.name}`)
      .send({
        name: "Cucumbers",
        price: "7.99"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      item: { name: "Cucumbers", price: "7.99" }
    });
  });

  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).patch(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

//DELETE /delete item by name
describe("DELETE /items/:name", function() {
  test("Deletes a single a item", async function() {
    const resp = await request(app).delete(`/items/${tomatoes.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
// end
