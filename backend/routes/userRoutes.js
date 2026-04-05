const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// POST: Add user
router.post("/", async (req, res) => {
  try {
    console.log("Incoming:", req.body);

    const { name, count } = req.body;

    const { data, error } = await supabase
      .from('users')
      .insert({ name, count })
      .select()
      .single();

    if (error) {
      console.log("Supabase ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Get all users
router.get("/", async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log("Supabase ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(users);
});

module.exports = router;
