const request = require("supertest");
const app = require("../app"); // Path to your app.js
const Employee = require("../models/employee");
const OTP = require("../models/otp");
const { generateToken } = require("../helpers/authHelper");

jest.mock("../models/employee");
jest.mock("../models/otp");
jest.mock("../helpers/authHelper");

describe("Employee API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it("should return 400 if validation fails when creating an employee", async () => {
  //   const response = await request(app)
  //     .post("/v1/auth/create-employee")
  //     .set("Authorization", "Bearer test-token") // Mock token
  //     .send({ emp_id: "", name: "", role: "", email: "", department: "" });

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toContain("Validation failed");
  // });

  // it("should create a new employee successfully", async () => {
  //   const mockEmployee = {
  //     emp_id: 123, // Ensuring numeric emp_id
  //     name: "John Doe",
  //     role: "Developer",
  //     email: "johndoe@example.com",
  //     department: "Engineering",
  //   };

  //   Employee.findOne.mockResolvedValue(null);
  //   Employee.prototype.save = jest.fn().mockResolvedValue(mockEmployee);

  //   const response = await request(app)
  //     .post("/v1/auth/create-employee")
  //     .set("Authorization", "Bearer test-token") // Mock token
  //     .send(mockEmployee);

  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe("User created successfully");
  // });

  // it("should return 403 if emp_id already exists", async () => {
  //   Employee.findOne.mockResolvedValue({ emp_id: 123 });

  //   const response = await request(app)
  //     .post("/v1/auth/create-employee")
  //     .set("Authorization", "Bearer test-token") // Mock token
  //     .send({
  //       emp_id: 123,
  //       name: "John Doe",
  //       role: "Developer",
  //       email: "johndoe@example.com",
  //       department: "Engineering",
  //     });

  //   expect(response.status).toBe(403);
  //   expect(response.body.error).toBe(
  //     "This emp ID already exists. Please choose another one."
  //   );
  // });

  it("should return 400 if validation fails during login", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ emp_id: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("ID must be a number.");
  });

  it("should return 404 if employee does not exist", async () => {
    Employee.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/v1/auth/login")
      .send({ emp_id: 999 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("This Employee ID does not exist!");
  });

  it("should return 200 and send OTP after successful login", async () => {
    const mockEmployee = { emp_id: 123, email: "johndoe@example.com" };
    Employee.findOne.mockResolvedValue(mockEmployee);
    OTP.prototype.save = jest.fn().mockResolvedValue({ otp: "123456" });

    const response = await request(app)
      .post("/v1/auth/login")
      .send({ emp_id: 123 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("OTP sent successfully");
  });

  it("should return 400 if emp_id or otp is missing during OTP verification", async () => {
    const response = await request(app).post("/v1/auth/verify-otp").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("emp_id and otp are required!");
  });

  it("should return 400 if OTP is invalid", async () => {
    OTP.findOne.mockResolvedValue({ otp: "123456", count: 0 });

    const response = await request(app)
      .post("/v1/auth/verify-otp")
      .send({ emp_id: 123, otp: "654321" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid OTP. Please try again!");
  });

  it("should return 200 and successful login if OTP is correct", async () => {
    OTP.findOne.mockResolvedValue({ otp: "123456", count: 0 });
    Employee.findOne.mockResolvedValue({ emp_id: 123, role: "Admin" });

    //generate token
    generateToken.mockResolvedValue("mocked-jwt-token");

    const response = await request(app)
      .post("/v1/auth/verify-otp")
      .send({ emp_id: 123, otp: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.data).toBe("mocked-jwt-token");
  });
});
