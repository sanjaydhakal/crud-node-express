const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Todo = require('./model/todo.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.get('/tasks', (req, res) => {
    res.json({ "message": "Hello Crud Node Express" });
});

const TodoRoute = require('./routes/todo');

app.use('/todo', TodoRoute);

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});

app.post('/tasks', (req, res) => {
    const newTask = new Todo({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    });

    newTask.save()
        .then(task => {
            res.status(201).json(task);
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not create task' });
        });
});

// Route to update a todo item
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updateData = {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    };

    Todo.findByIdAndUpdate(taskId, updateData, { new: true })
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(updatedTask);
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not update task' });
        });
});

// Route to delete a todo item
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    Todo.findByIdAndDelete(taskId)
        .then(deletedTask => {
            if (!deletedTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not delete task' });
        });
});

