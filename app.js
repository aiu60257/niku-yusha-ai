const API_URL = "https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate";

// ===== モード切替 =====
// true → テスト（履歴保存しない）
// false → 本番
const TEST_MODE = true;

async function generateTweet(){

  const world = await fetch("data/world.json").then(r=>r.json());
  const characters = await fetch("data/characters.json").then(r=>r.json());
  const story = await fetch("data/story.json").then(r=>r.json());

  let history = await fetch("data/history.json").then(r=>r.json());
  let state = await fetch("data/state.json").then(r=>r.json());

  // ===== トレンド（仮：自動の代わりに固定 → 後でAPI化）=====
  const trends = ["炎上","AI","SNS規制"];

  // 直近5件だけ使う
  const recent = history.posts.slice(-5).map(p=>p.text).join("\n");

  const prompt = `
あなたは肉勇者です。

▼状態
${JSON.stringify(state)}

▼直近投稿
${recent}

▼トレンド
${trends.join(",")}

▼ルール
・100文字前後
・改行あり
・一人称「私」
・シュール＋哲学＋少し笑える
・説明禁止
・矛盾禁止
`;

  const res = await fetch(API_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({prompt})
  });

  const data = await res.json();

  document.getElementById("result").innerText = data.text;

  // ===== テストモードなら保存しない =====
  if(TEST_MODE) return;

  // ===== 保存処理 =====
  history.posts.push({
    text: data.text,
    timestamp: new Date().toISOString()
  });

  // 状態更新（簡易）
  state.tension += 1;
  state.yu_growth += 1;
  state.last_event = data.text;

  console.log("保存されたデータ", history, state);
}

// ===== 再生成（履歴に影響なし）=====
async function regenerate(){
  await generateTweet();
}

// ServiceWorker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
