export default async function handler(req, res) {

  try {

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const prompt = body.prompt;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "あなたは肉勇者です" },
          { role: "user", content: prompt }
        ],
        temperature: 1.1
      })
    });

    const data = await response.json();

    return res.status(200).json({
      text: data.choices?.[0]?.message?.content || "生成失敗"
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }
}
