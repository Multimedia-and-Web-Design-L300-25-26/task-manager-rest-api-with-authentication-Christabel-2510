// Task model with in-memory fallback when testing

import mongoose from "mongoose";

let Task;

if (process.env.NODE_ENV === "test") {
  const tasks = [];
  let idCounter = 1;

  class InMemoryTask {
    constructor(data) {
      Object.assign(this, data);
      this._id = `${idCounter++}`;
    }

    async save() {
      tasks.push(this);
      return this;
    }

    static async find(query) {
      if (query.owner) {
        return tasks.filter(
          (t) => t.owner.toString() === query.owner.toString()
        );
      }
      return tasks;
    }

    static async findById(id) {
      return tasks.find((t) => t._id.toString() === id.toString()) || null;
    }

    static async findByIdAndDelete(id) {
      const idx = tasks.findIndex((t) => t._id.toString() === id.toString());
      if (idx > -1) {
        return tasks.splice(idx, 1)[0];
      }
      return null;
    }
  }

  Task = InMemoryTask;
} else {
  // Create Task schema
  const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  Task = mongoose.model("Task", taskSchema);
}

export default Task;
