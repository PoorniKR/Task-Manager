import { useState, useEffect } from "react"
import axios from "axios";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";

function App() {
  const [newTodo, setNewTodo] = useState("")
  const [todo, setTodo] = useState([]);
  const [updateTodo, setUpdateTodo] = useState(null);
  const [updatedText, setUpdatedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if(!newTodo.trim()) return;
    try {
      const res = await axios.post("/api/todos", {text: newTodo})
      setTodo([...todo, res.data])
      setNewTodo('')
    } catch (error) {
      console.log("Error adding task", error)
    }
  }

  const fetchTodos = async () => {
    try {
      const resp = await axios.get("/api/todos");
      console.log(resp.data);
      setTodo(resp.data)
    } catch (error) {
      console.log("Error fetching tasks", error);
    }
  }

  useEffect(()=>{
    fetchTodos();
  }, [])

  const onUpdate = (todo) => {
    setUpdateTodo(todo._id)
    setUpdatedText(todo.text)
  }

  const saveUpdate = async (id) => {
    try {
      const resp = await axios.patch(`/api/todos/${id}`,{
        text: updatedText
      })
      setTodo(todo.map((todo)=>(
        todo._id === id ? resp.data : todo
      )))
      setUpdateTodo(null)
    } catch (error) {
      console.log("Error updating task:", error);
      
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodo(todo.filter((todo) => todo._id !== id))
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todos = todo.find((t) => t._id === id );
      const res = await axios.patch(`/api/todos/${id}`, {completed: !todos.completed,})
      setTodo(todo.map((t) => (t._id === id ? res.data : t)))
    } catch (error) {
      console.log("Error toggling task:", error);
      
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2x1 shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-8 text-center">
          Task Manager
        </h1>
        
        <form onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg"
        >
          <input 
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done??"
            required
          />
          <button type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
          >
            Add Task
          </button>
        </form>
        
        <div className="mt-4">
          {todo.length === 0 ? (
            <></>
          ) : (
            <div className="flex flex-col gap-4">
              {todo.map((todo)=>(
                <div key={todo._id}>
                  {updateTodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3 rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        type="text"
                        value={updatedText}
                        onChange={(e) => setUpdatedText(e.target.value)}
                      />
                      <div className="flex gap-x-2">
                        <button onClick={()=>saveUpdate(todo._id)}
                          className="px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                        >
                          <MdOutlineDone />
                        </button>
                        <button onClick={()=>setUpdateTodo(null)}
                          className="px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4 overflow-hidden">
                          <button onClick={()=> toggleTodo(todo._id)}
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
                              todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-400"}`}
                          >
                            {todo.completed && <MdOutlineDone />}
                          </button>
                          <span className="text-gray-800 truncate font-medium">
                            {todo.text}
                          </span>
                        </div>
                        <div className="flex gap-x-2">
                          <button onClick={()=> onUpdate(todo)}
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"  
                          >
                            <MdModeEditOutline />
                          </button> 
                          <button onClick={()=> deleteTodo(todo._id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"  
                          >
                            <FaTrash />
                          </button> 
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
