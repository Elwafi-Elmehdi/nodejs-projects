const app = require("../src/app");
const Task = require("../src/models/task");
const request = require("supertest");
const { user1Id, user1, user2, setUpDB, taskTwo } = require("./fixtures/db");

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

test("Should get all user one tasks", async () => {
	const response = await request(app)
		.get("/tasks")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send()
		.expect(200);

	expect(response.body.length).toBe(2);
});

test("Should test delete task security", async () => {
	await request(app)
		.delete(`/task/${taskTwo._id}`)
		.set("Authorization", `Bearer ${user2.tokens[0].token}`)
		.send()
		.expect(404);
	const task = await Task.findById(taskTwo._id);
	expect(task).not.toBeNull();
});

test("Should not delete task ", async () => {
	await request(app).delete(`/task/${taskTwo._id}`).send().expect(401);
});

test("Should filter tasks by completed=true", async () => {
	const response = await request(app)
		.get("/tasks?completed=true")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send()
		.expect(200);
	const task = await Task.find({ owner: user1Id, completed: true });
	expect(response.body).toHaveLength(1);
});
