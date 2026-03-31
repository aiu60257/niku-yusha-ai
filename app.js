const API_URL = "https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate";

// ===== モード =====
// true：テスト（履歴保存しない）
// false：本番（履歴保存する）
const TEST_MODE = true;

async function generateTweet(){

  const mode = document.getElementById("mode").value;

  // ===== データ読み込み =====
  const world = await fetch("data/world.json").then(r=>r.json());
  const characters = await fetch("data/characters.json").then(r=>r.json());
  const story = await fetch("data/story.json").then(r=>r.json());

  let state = await fetch("data/state.json").then(r=>r.json());

  // 履歴を分離
  let history;
  if(mode === "story"){
    history = await fetch("data/history_story.json").then(r=>r.json());
  }else{
    history = await fetch("data/history_daily.json").then(r=>r.json());
  }

  // ===== トレンド（仮：後で自動取得に差し替え）=====
  const trends = ["AI","物価高","SNS炎上","仕事"];

  // ===== 直近履歴 =====
  const recent = history.posts.slice(-5).map(p=>p.text).join("\n");

  // ===== プロンプト分岐 =====
  let prompt = "";

  // ===== ストーリー =====
  if(mode === "story"){
    prompt = `
あなたは肉勇者です。

▼投稿タイプ
ストーリー

▼ルール
・100文字前後
・物語が進む内容
・ややシリアス
・最後に引きを入れる
・【第一話】などタイトルOK
・一人称「私」
・矛盾禁止

▼状態
${JSON.stringify(state)}

▼過去の流れ
${recent}
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
・ボケ7：シリアス3
・オチを入れる
・テンポ重視
・一人称「私」

▼トレンド
${trends.join(",")}
`;
  }

  // ===== API呼び出し =====
  const res = await fetch(API_URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({prompt})
  });

  const data = await res.json();

  // ===== 表示 =====
  document.getElementById("result").innerText = data.text;

  // ===== テストモードなら保存しない =====
  if(TEST_MODE) return;

  // ===== 保存処理 =====
  history.posts.push({
    text: data.text,
    timestamp: new Date().toISOString(),
    type: mode
  });

  // ===== 状態更新（ストーリー時のみ）=====
  if(mode === "story"){
    state.tension += 2;
    state.yu_growth += 1;
    state.last_event = data.text;
  }

  console.log("保存（仮）", history, state);
}


// ===== 再生成（履歴に影響なし）=====
async function regenerate(){
  await generateTweet();
}


// ===== ServiceWorker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
