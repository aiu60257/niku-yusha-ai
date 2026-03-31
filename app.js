const API_URL = "https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate";

// ===== モード =====
// true：テスト（保存しない）
// false：本番（保存する）
const TEST_MODE = true;


// ===== トレンド取得（簡易）=====
async function getTrends(){
  return ["AI","物価高","SNS炎上","仕事"];
}


// ===== バズ判定 =====
function isGoodTweet(text){

  if(!text) return false;

  // 禁止ワード（名前ブレ対策）
  if(text.includes("友達") || text.includes("彼")) return false;

  let score = 0;

  if(text.includes("私")) score += 1;
  if(text.includes("\n")) score += 1;
  if(text.length >= 40 && text.length <= 120) score += 2;

  return score >= 3;
}


// ===== メイン =====
async function generateTweet(){

  const mode = document.getElementById("mode").value;

  // データ読み込み
  let state = await fetch("data/state.json").then(r=>r.json());

  let history;
  if(mode === "story"){
    history = await fetch("data/history_story.json").then(r=>r.json());
  }else{
    history = await fetch("data/history_daily.json").then(r=>r.json());
  }

  const trends = await getTrends();

  const recent = history.posts.slice(-5).map(p=>p.text).join("\n");

  const storyNumber = state.story_number || 1;

  let prompt = "";

  // ===== ストーリー =====
  if(mode === "story"){
    prompt = `
あなたは肉勇者です。

▼投稿タイプ
ストーリー

▼ルール
・100文字前後
・物語が進む
・最後に引き
・【第${storyNumber}話】を必ず付ける

▼名前ルール（厳守）
・ゆうは必ず「ゆう」
・他の呼び方禁止（友、友達、彼は禁止）
・魔王は「トレンドン」または「トレンドン会長」
・違反したらERRORと出力

▼状態
${JSON.stringify(state)}

▼過去
${recent}

▼トレンド
${trends.join(",")}
`;
  }

  // ===== 日常 =====
  else{
    prompt = `
あなたは肉勇者です。

▼投稿タイプ
日常

▼ルール
・40〜80文字
・会話形式OK
・オチ必須

▼名前ルール（厳守）
・ゆうは必ず「ゆう」
・他の呼び方禁止（友、友達、彼は禁止）

▼トレンド
${trends.join(",")}
`;
  }

  // ===== AI生成（最大5回リトライ）=====
  let data;
  let attempts = 0;

  do{
    const res = await fetch(API_URL,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({prompt})
    });

    data = await res.json();
    attempts++;

  }while(!isGoodTweet(data.text) && attempts < 5);

  document.getElementById("result").innerText = data.text;


  // ===== テストモードなら保存しない =====
  if(TEST_MODE) return;


  // ===== 保存 =====
  history.posts.push({
    text: data.text,
    timestamp: new Date().toISOString()
  });

  // ===== 状態更新 =====
  if(mode === "story"){
    state.story_number += 1;
    state.tension += 2;
    state.yu_growth += 1;
    state.last_event = data.text;
  }

  console.log("保存データ", history, state);
}


// ===== 再生成 =====
async function regenerate(){
  await generateTweet();
}


// ===== ServiceWorker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
