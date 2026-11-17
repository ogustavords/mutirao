import { useState } from 'react'
import './App.css'

const initialTasks = [
  { id: 1, title: 'organizar reunião do coletivo', status: 'pendente' },
  { id: 2, title: 'divulgar próximo mutirão', status: 'concluída' },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState('')

  function addTask(event) {
    event.preventDefault()
    if (!newTask.trim()) return

    const task = {
      id: Date.now(),
      title: newTask,
      status: 'pendente',
    }

    setTasks([...tasks, task])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === 'concluída' ? 'pendente' : 'concluída',
        }
      }
      return task
    }))
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 min-w-0" id="tarefas">
        <section className="max-w-[1000px] mx-auto py-[50px] px-[5%] md:px-[20px]">
          <p className="text-[#ffa1ef] text-[20px] font-bold">VISÃO GERAL</p>
          <p className="text-[#9298a5] text-[14px] mt-2 mb-6">
            teste para aprender e praticar React, com foco em hooks e gerenciamento de estado.
          </p>

          <section>
            <div className="mb-5">
              <h3 className="text-[19px] font-semibold mb-1">tarefas do coletivo</h3>
            </div>

            <form className="flex flex-col md:flex-row gap-2.5 my-6" onSubmit={addTask}>
              <input
                type="text"
                placeholder="qual é a próxima tarefa?"
                value={newTask}
                onChange={event => setNewTask(event.target.value)}
                className="min-w-0 flex-1 py-[15px] px-[15px] text-[#f3f4f6] bg-[#14171e] border border-[#303541] outline-none focus:border-[#ffa1ef]"
              />
              <button 
                type="submit"
                className="py-3 px-[17px] border-0  bg-[#ffa1ef] text-[#18210d] font-bold cursor-pointer hover:brightness-110 transition"
              >
                + adicionar
              </button>
            </form>

            <div className="grid gap-2.5">
              {tasks.map(task => (
                <article 
                  className="bg-[#14171e] border border-[#282c36] min-w-0 p-[17px] flex flex-wrap md:flex-nowrap items-center gap-[13px]" 
                  key={task.id}
                >
                  
                  <span className="flex-1 break-words text-[14px]">{task.title}</span>
                  
                  <button
                    className={`flex-shrink-0 py-1.5 px-2.5 text-[11px] border-0 cursor-pointer font-inherit transition hover:brightness-125 ml-auto md:ml-0 ${
                      task.status === 'concluída' 
                        ? 'bg-[#203522] text-[#a3e6a9]' 
                        : 'bg-[#252932] text-[#ffa1ef]'
                    }`}
                    onClick={() => toggleTask(task.id)}
                    type="button"
                  >
                    {task.status === 'concluída' ? ' concluída' : 'marcar como concluída'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App