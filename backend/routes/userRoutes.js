const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const protect = require("../middleware/authMiddleware");

// ✅ PROTECTED ROUTE
router.post("/", protect, async (req, res) => {
  try {
    const { name, count } = req.body;

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, count }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET users
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;