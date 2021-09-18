const app = require("../src/app");
const Task = require("../src/models/task");
const request = require("supertest");
const { user1Id, user1, setUpDB } = require("./fixtures/db");

beforeEach(setUpDB);

test("Should create a new task", async () => {
	const response = await request(app)
		.post("/tasks")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send({
			label: "Task-01",
			desc: "Learn Testing Software",
		})
		.expect(201);
	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.owner).toEqual(user1Id);
	expect(task.completed).toBeFalsy();
});
