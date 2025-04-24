import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [userIp, setUserIp] = useState(null);

  // 사용자의 IP 가져오기
  useEffect(() => {
    fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setUserIp(data.ip);
      })
      .catch((err) => console.error("IP 가져오기 실패:", err));
  }, []);

  // IP에 맞는 To-Do 리스트 불러오기
  useEffect(() => {
    if (userIp) {
      const savedTodos = localStorage.getItem(`todos_${userIp}`);
      setTodos(savedTodos ? JSON.parse(savedTodos) : {});
    }
  }, [userIp]);

  // 로컬스토리지에 저장
  useEffect(() => {
    if (userIp) {
      localStorage.setItem(`todos_${userIp}`, JSON.stringify(todos));
    }
  }, [todos, userIp]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos({
      ...todos,
      [selectedDate]: [...(todos[selectedDate] || []), { text: input, completed: false }],
    });
    setInput("");
  };

  const toggleTodo = (index) => {
    const updatedTodos = todos[selectedDate].map((todo, todoIndex) =>
      todoIndex === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos({ ...todos, [selectedDate]: updatedTodos });
  };

  const deleteTodo = (index) => {
    const newTodos = todos[selectedDate].filter((_, todoIndex) => todoIndex !== index);
    setTodos({ ...todos, [selectedDate]: newTodos });
  };

  return (
    <div className="App">
      <h1><i>📋</i> To-Do List</h1>
      <label for="datePicker" >
        <input className="dateCheck" id="datePicker" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </label>
      <br />
      <input className="inputList"  type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="내용을 입력해주세요.." />
      <button className="addBtn" onClick={addTodo}>+</button>
      <ul className="listAll">
        {(todos[selectedDate] || []).map((todo, index) => (
          <li key={index}>
              <input id="custom-checkbox" class="checkIcon custom-checkbox" type="checkbox" checked={todo.completed} onChange={() => toggleTodo(index)} />
              <b className="checkmark"></b>
              <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</span>
            <button className="subtractBtn"  onClick={() => deleteTodo(index)}>-</button>
          </li>
        ))}
      </ul>

      <div className="ip_address">{userIp ? <p>현재 IP: {userIp}</p> : <p>IP 가져오는 중...</p>}</div>
    </div>
  );
}

export default App;
