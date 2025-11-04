import axios from 'axios';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const TestComponent = () => {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);
  
  return (
    <div>
      <h2>Test Data from JSONPlaceholder</h2>
      {todos.slice(0, 5).map(todo => (
        <div key={todo.id}>
          <p><strong>Title:</strong> {todo.title}</p>
          <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};