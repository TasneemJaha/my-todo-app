

import { useEffect, useState } from 'react'

type Task = {
  id: number
  title: string
  completed: boolean
}

type Filter = 'All' | 'Active' | 'Completed'

export function GridBackground() {
  const [tasks, setTasks] = useState<Task[]>(() => {
      try {
    const savedTasks = localStorage.getItem('my-todo-tasks')
    return savedTasks ? JSON.parse(savedTasks) as Task[] : []
  } catch {
    return []
  }
})
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('All')
  useEffect(() => {
  localStorage.setItem('my-todo-tasks', JSON.stringify(tasks))
}, [tasks])

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  const remainingCount = tasks.length - completedCount

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'Active') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  })

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = input.trim()
    if (!title) return

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ])

    setInput('')
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id: number) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    )
  }

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#fafaf9',
      backgroundImage:
        'linear-gradient(to right, rgba(71,85,105,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,85,105,0.09) 1px, transparent 1px)',
      backgroundSize: '32px 32px',
      padding: '64px 20px',
      boxSizing: 'border-box' as const,
      color: '#252522',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    container: {
      maxWidth: '660px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e7e5e4',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 12px 40px rgba(28, 25, 23, 0.05)',
    },
  }

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <header style={{ marginBottom: '28px' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#78716c',
              marginBottom: '12px',
            }}
          >
            YOUR PERSONAL WORKSPACE
          </p>

          <h1
            style={{
              fontSize: 'clamp(34px, 6vw, 46px)',
              letterSpacing: '-1.8px',
              margin: '0 0 10px',
              fontWeight: 700,
            }}
          >
            My To-Do List<span style={{ color: '#b4533c' }}>.</span>
          </h1>

          <p style={{ color: '#78716c', margin: 0, lineHeight: 1.6 }}>
            A little progress, every day.
          </p>
        </header>

        <section style={styles.card}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>
                Today
              </h2>
              <p style={{ margin: 0, color: '#78716c', fontSize: '14px' }}>
                {remainingCount === 0
                  ? tasks.length === 0
                    ? 'A fresh start. What needs doing?'
                    : 'Everything is checked off. Nice work!'
                  : `${remainingCount} ${remainingCount === 1 ? 'task' : 'tasks'} left to complete`}
              </p>
            </div>

            <div
              style={{
                border: '1px solid #e7e5e4',
                borderRadius: '10px',
                padding: '10px 14px',
                textAlign: 'center' as const,
                minWidth: '66px',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 700 }}>
                {completedCount}/{tasks.length}
              </div>
              <div
                style={{
                  color: '#78716c',
                  fontSize: '10px',
                  marginTop: '3px',
                }}
              >
                DONE
              </div>
            </div>
          </div>

          <form
            onSubmit={addTask}
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="What do you need to get done?"
              aria-label="New task"
              style={{
                flex: 1,
                minWidth: 0,
                padding: '14px',
                border: '1px solid #d6d3d1',
                borderRadius: '9px',
                fontSize: '14px',
                outlineColor: '#b4533c',
                backgroundColor: '#fff',
              }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: '#292524',
                color: '#fff',
                border: 'none',
                borderRadius: '9px',
                padding: '0 18px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              + Add
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              gap: '6px',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '14px',
              marginBottom: '8px',
            }}
          >
            {(['All', 'Active', 'Completed'] as Filter[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: filter === item ? '#f5f5f4' : 'transparent',
                  color: filter === item ? '#292524' : '#78716c',
                  fontWeight: filter === item ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
            {visibleTasks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '38px 12px',
                  color: '#78716c',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>
                  {tasks.length === 0 ? '○' : '✓'}
                </div>
                <p
                  style={{
                    color: '#44403c',
                    fontWeight: 600,
                    margin: '0 0 6px',
                  }}
                >
                  {tasks.length === 0
                    ? 'Your list starts here'
                    : 'No tasks in this view'}
                </p>
                <p style={{ fontSize: '13px', margin: 0 }}>
                  {tasks.length === 0
                    ? 'Add your first task above to get started.'
                    : 'Try choosing a different filter.'}
                </p>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px 4px',
                    borderBottom: '1px solid #f0eeec',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${task.completed ? 'active' : 'completed'}`}
                    style={{
                      width: '17px',
                      height: '17px',
                      accentColor: '#b4533c',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflowWrap: 'anywhere' as const,
                      fontSize: '14px',
                      color: task.completed ? '#a8a29e' : '#292524',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#a8a29e',
                      cursor: 'pointer',
                      padding: '6px',
                      fontSize: '18px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {tasks.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                marginTop: '20px',
                color: '#78716c',
                fontSize: '12px',
              }}
            >
              <span>
                {completedCount} of {tasks.length} completed
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setTasks((current) =>
                      current.filter((task) => !task.completed)
                    )
                  }
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#9a3412',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: 0,
                  }}
                >
                  Clear completed
                </button>
              )}
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: 'center',
            color: '#78716c',
            fontSize: '12px',
            marginTop: '22px',
          }}
        >
          One thing at a time. You’ve got this.
        </footer>
      </main>
    </div>
  )
}
