import { describe, it, expect } from 'vitest'
import axios from 'axios'

describe('API Testing with JSONPlaceholder', () => {
  it('should fetch todos from JSONPlaceholder', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    
    expect(response.status).toBe(200)
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data.length).toBeGreaterThan(0)
    
    const firstTodo = response.data[0]
    expect(firstTodo).toHaveProperty('id')
    expect(firstTodo).toHaveProperty('title')
    expect(firstTodo).toHaveProperty('completed')
    expect(firstTodo).toHaveProperty('userId')
  })
  
  it('should fetch a single todo', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    
    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('id', 1)
    expect(response.data).toHaveProperty('title')
  })
})