// app/controllers/Todo.js

const TodoModel = require('../model/todo');

// Create and Save a new todo
exports.create = async (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const todo = new TodoModel({
        title: req.body.title,
        description: req.body.description || '',
        completed: req.body.completed || false
    });

    await todo.save().then(data => {
        res.send({
            message: "Todo created successfully!!",
            todo: data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the todo"
        });
    });
};

// Retrieve all todos from the database
exports.findAll = async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Find a single todo with an id
exports.findOne = async (req, res) => {
    try {
        const todo = await TodoModel.findById(req.params.id);
        if (!todo) {
            res.status(404).send({ message: "Todo not found" });
        } else {
            res.status(200).json(todo);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update a todo by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
        return;
    }

    const id = req.params.id;

    await TodoModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Todo not found.`
            });
        } else {
            res.send({ message: "Todo updated successfully." });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// Delete a todo with the specified id in the request
exports.destroy = async (req, res) => {
    await TodoModel.findByIdAndRemove(req.params.id).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Todo not found.`
            });
        } else {
            res.send({
                message: "Todo deleted successfully!"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};
