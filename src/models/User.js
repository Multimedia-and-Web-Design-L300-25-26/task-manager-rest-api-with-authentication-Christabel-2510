// this file exports either a Mongoose model or a simple in-memory class for testing

import mongoose from "mongoose";

let User;

if (process.env.NODE_ENV === "test") {
  // simple in-memory store
  const users = [];

  class InMemoryUser {
    constructor(data) {
      Object.assign(this, data);
    }

    async save() {
      // enforce unique email
      if (users.find((u) => u.email === this.email)) {
        const err = new Error("Email already exists");
        err.code = 11000;
        throw err;
      }
      this._id = `${users.length + 1}`;
      users.push(this);
      return this;
    }

    static async findOne(query) {
      return users.find((u) => u.email === query.email) || null;
    }

    static async findById(id) {
      return users.find((u) => u._id === id) || null;
    }
  }

  User = InMemoryUser;
} else {
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  User = mongoose.model("User", userSchema);
}

export default User;
