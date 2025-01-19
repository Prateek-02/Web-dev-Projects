import { useState } from "react"
import Navbar from "./components/Navbar"
import { use } from "react"
const { v4: uuidv4 } = require( 'uuid');


function App() {

  const[todo, setTodo] = useState("")
  const[todos, setTodos] = useState([])

  
  const handleEdit = () =>{

  }

  const handleDelete = () =>{

  }

  const handleAdd = () =>{
    setTodos([...todos,{id: uuidv4(), todo, isCompleted: false}]);
    setTodo("")
  }

  const handleChange = (e) =>{
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) =>{
    let id = e.target.name;
    let index = todos.findIndex(item=>{
      return item.id === id;
    })

    let newTodos = todos;
    newTodos[index].isCompleted = !newTodos[index].isCompleted
  }

  return (
    <>
      <Navbar/>
      <div className="container mx-auto my-5 p-5 rounded-xl bg-violet-50 min-h-[70vh]">
          <div className="addTodo my-5">
            <h2 className="text-lg font-bold">Add a Todo</h2>
            <input onChange={handleChange} value={todo} type="text" className="rounded-lg p-3 py-2 bg-slate-300 w-1/2" />
            <button onClick={handleAdd} className="bg-violet-700 rounded-lg mx-5 p-3 py-2 hover:bg-violet-900 font-bold text-white">Add</button>
          </div>
          <h2 className="text-xl font-bold">Your Todos</h2>
          <div className="todos">
            {todos.map(item=>{
            return <div key={todo} className="todo flex w-1/2 justify-between my-2">
              <input onChange={handleCheckbox} type="checkbox" value={todo.isCompleted} name={todo.id} id="" />
              <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
              <div className="buttons">
                <button onClick={handleEdit} className="bg-violet-700 rounded-lg mx-1 p-2 py-1 hover:bg-violet-900 font-bold text-white">Edit</button>
                <button onClick={handleDelete} className="bg-violet-700 rounded-lg mx-1 p-2 py-1  hover:bg-violet-900 font-bold text-white">Delete</button>
              </div>
            </div>
            })}
          </div>
      </div>
    </>
  )
}

export default App
