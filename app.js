const API_URL = "https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate";


// ===== メイン =====
async function generateStory(){

  const seed = await fetch("data/story_seed.json").then(r=>r.json());

  const ep = seed.episodes[0]; // 今回は第1話固定

  const prompt = `
あなたはプロの小説家です。
以下のJSON設定を100%厳守して文章を生成してください。

【最重要ルール】
・構造を絶対に守る
・改行の位置を再現する
・テンポを再現する
・セリフ形式を守る（名前：「セリフ」）
・説明口調は禁止
・必ず自然な会話にする

【キャラルール】
・肉勇者 → 短く喋る（命令形）
・ゆう → 驚き・ツッコミ
・「友達」「友人」「彼」禁止

【やること】
sample_outputの“構造・テンポ・流れ”をコピーし、
文章は完全に別表現で生成する

【JSON設定】
${JSON.stringify(ep)}

【出力条件】
・文章のみ出力
・解説禁止
`;

  const res = await fetch(API_URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({prompt})
  });

  const data = await res.json();

  document.getElementById("result").innerText = data.text;
}


// ===== 再生成 =====
async function regenerate(){
  await generateStory();
}


// ===== ServiceWorker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
