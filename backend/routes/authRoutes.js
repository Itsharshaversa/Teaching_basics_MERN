const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const generateToken = require("../config/jwt");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, password }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    user: data,
    token: generateToken(data.id),
  });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", name)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    user: data,
    token: generateToken(data.id),
  });
});

module.exports = router;