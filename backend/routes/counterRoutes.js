const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET counter
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from('counters')
    .select('count, id')
    .maybeSingle();

  if (error || !data) {
    // Create if not exists
    const { data: newCounter, error: createError } = await supabase
      .from('counters')
      .insert({ count: 0 })
      .select('count')
      .single();

    if (createError) {
      console.log("Supabase create error:", createError);
      return res.status(500).json({ error: createError.message });
    }
    return res.json({ count: newCounter.count });
  }

  res.json({ count: data.count });
});

// INCREMENT counter
router.post("/increment", async (req, res) => {
  const { data: current, error: getError } = await supabase
    .from('counters')
    .select('count')
    .maybeSingle();

  const newCount = (current?.count || 0) + 1;

  const { data: updated, error: updateError } = await supabase
    .from('counters')
    .upsert([{ count: newCount }], { onConflict: 'id' })
    .select('count')
    .single();

  if (updateError) {
    console.log("Supabase update error:", updateError);
    return res.status(500).json({ error: updateError.message });
  }

  res.json({ count: updated.count });
});

module.exports = router;
