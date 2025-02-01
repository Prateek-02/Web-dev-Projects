import { useState } from "react"
import Navbar from "./components/Navbar"
import { v4 as uuidv4 } from 'uuid';


function App() {

  const[todo, setTodo] = useState("")
  const[todos, setTodos] = useState([])

  
  const handleEdit = (e,id) =>{
    let t = todos.filter(i=>i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item=>{
      return item.id != id;
    });

    setTodos(newTodos)
  }

  const handleDelete = (e,id) =>{

    let newTodos = todos.filter(item=>{
      return item.id != id;
    });

    setTodos(newTodos)
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

    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
  }

  return (
    <>
      <Navbar/>
      <div className="container mx-auto my-5 p-5 rounded-xl bg-violet-50 min-h-[70vh]">
          <div className="addTodo my-5">
            <h2 className="text-lg font-bold">Add a Todo</h2>
            <input onChange={handleChange} value={todo} type="text" className="rounded-lg p-3 py-2 bg-slate-300 w-1/2" />
            <button onClick={handleAdd} className="bg-violet-700 rounded-lg mx-5 p-3 py-2 hover:bg-violet-900 font-bold text-white">Save</button>
          </div>
          <h2 className="text-xl font-bold">Your Todos</h2>
          <div className="todos">
            {todos.length === 0 && <div className="m-5">No Todos to display</div>}
            {todos.map(item=>{
            return <div key={item.id} className="todo flex w-1/2 justify-between my-2">
              <div className="flex gap-5" >
              <input onChange={handleCheckbox} type="checkbox" value={item.isCompleted} name={item.id} id="" />
              <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
              </div>
              <div className="buttons">
                <button onClick={(e)=>handleEdit(e,item.id)} className="bg-violet-700 rounded-lg mx-1 p-2 py-1 hover:bg-violet-900 font-bold text-white">Edit</button>
                <button onClick={(e)=>{handleDelete(e,item.id)}} className="bg-violet-700 rounded-lg mx-1 p-2 py-1  hover:bg-violet-900 font-bold text-white">Delete</button>
              </div>
            </div>
            })}
          </div>
      </div>
    </>
  )
}

export default App
