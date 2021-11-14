require("dotenv").config();
const debug = require("debug")("series:testing:endpoints");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { initializeServer, app } = require("..");
const initializeMongo = require("../../database");
const User = require("../../database/models/user");

const request = supertest(app);

let server;

beforeAll(async () => {
  await initializeMongo(process.env.MONGODB_STRING_TEST);
  await User.deleteMany({});
  server = await initializeServer(process.env.SERVER_PORT_TEST);
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    debug(chalk.red("Server conection ended"));
    done();
  });
});

beforeEach(async () => {
  await User.create({
    name: "Victor",
    username: process.env.MONGODB_LOGIN,
    password: await bcrypt.hash(process.env.MONGODB_PASSWORD, 10),
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When a POST request arrives with a bad username and password", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .post("/users/login")
        .send({ username: "aqw", password: "aasd" })
        .expect(401);
    });
  });
  describe("When a POST request arrives with the correct username and password", () => {
    test("Then it should respond with a 200", async () => {
      await request
        .post("/users/login")
        .send({
          username: process.env.MONGODB_LOGIN,
          password: process.env.MONGODB_PASSWORD,
        })
        .expect(200);
    });
  });
});

describe("Given a /register endpoint", () => {
  describe("When a POST request arrives with bad parameters", () => {
    test("Then it should respond with a 400 error", async () => {
      await request.post("/users/register").send({}).expect(400);
    });
  });
  describe("When a POST request arrives with the right parameters", () => {
    test("Then it should respond with a 201", async () => {
      const user = {
        name: "pablo",
        username: "pablo",
        password: await bcrypt.hash("qwerty123", 10),
      };
      await request.post("/users/register").send(user).expect(201);
    });
  });
});
