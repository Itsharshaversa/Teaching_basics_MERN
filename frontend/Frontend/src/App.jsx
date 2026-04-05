import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState(null);
  const [users, setUsers] = useState([]);

  // ✅ Load data on start
  useEffect(() => {
    fetchCounter();
    fetchUsers();
  }, []);

  // ✅ Get counter
  const fetchCounter = async () => {
    const { data } = await supabase
      .from("counter")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) setCount(data.count);
  };

  // ✅ Get users (leaderboard)
  const fetchUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("count", { ascending: false });

    if (data) setUsers(data);
  };

  // ✅ Increment counter
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && name.trim() !== "") {
      const newCount = count + 1;

      const { data } = await supabase
        .from("counter")
        .update({ count: newCount })
        .eq("id", 1)
        .select();

      if (data) setCount(data[0].count);
    }
  };

  // ✅ Submit user
  const handleSubmit = async () => {
    if (!name) return;

    await supabase.from("users").insert([
      {
        name,
        count,
      },
    ]);

    setSubmitted({ name, count });
    setName("");

    await fetchUsers(); // refresh leaderboard
  };

  return (
    <div className="container">
      <motion.div
        className="card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>👋 Welcome</h1>
        <p className="subtitle">
          Type your name & press Enter to increase count
        </p>

        <input
          type="text"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="counter">{count}</div>

        <button onClick={handleSubmit}>Submit Session</button>

        {/* ✅ Submitted */}
        {submitted && (
          <motion.div
            className="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>🎉 Submitted</h3>
            <p><strong>{submitted.name}</strong></p>
            <p>Final Count: {submitted.count}</p>
          </motion.div>
        )}

        {/* 🏆 Leaderboard */}
        <h2 style={{ marginTop: "20px" }}>🏆 Leaderboard</h2>

        <div className="leaderboard">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              className="leader"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <span>#{i + 1}</span>
              <span>{u.name}</span>
              <span>{u.count}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default App;