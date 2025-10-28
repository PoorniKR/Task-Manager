import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();

// Get all to-do
router.get('/', async (req, res)=>{
    try {
        const todo = await Todo.find();
        res.json(todo);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Add a new to-do
router.post("/", async(req,res)=>{
    const todo = new Todo({
        text: req.body.text //Text from client as new todo
    })
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo)
    } catch (error) {
        res.status(400).json({message: error.message})        
    }
})

// Update to-do (text and/or completed)
router.patch("/:id", async (req,res)=>{
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) return res.status(404).json({message: "Todo not found"});

        if(req.body.text !== undefined){
            todo.text = req.body.text;
        }
        if(req.body.completed !== undefined){
            todo.completed = req.body.completed;
        }

        const updateTodo = await todo.save();
        res.json(updateTodo);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Delete a todo
router.delete("/:id", async (req,res)=>{
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({message: "Todo deleted"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

export default router;