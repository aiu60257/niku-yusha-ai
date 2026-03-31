const API_URL = "https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate";

const TEST_MODE = true;


// ===== キャラ定義 =====
const prompt = `
あなたはプロの小説家です。
以下のJSON設定を100%厳守して文章を生成してください。

【重要】
・フォーマットを崩すな
・セリフ構造を守れ
・改行を再現しろ
・テンポを再現しろ
・sample_outputを参考にしつつ“同じ構造で別表現”にする

【設定】
${JSON.stringify(ep)}

【出力条件】
・文章のみ出力
・解説禁止
・構造を完全再現

`;


// ===== ストーリー5話生成 =====
async function generateStory5(){

  const seed = await fetch("data/story_seed.json").then(r=>r.json());
  const character = getCharacterDefinition();

  let results = [];

  for(let i=0;i<seed.episodes.length;i++){

    const ep = seed.episodes[i];

    const prompt = `
${character}

【タイトル】
${ep.title}

【目的】
${ep.goal}

【感情】
${ep.emotion}

【フック】
${ep.hook}

【トーン】
${ep.tone}

【ルール】
・100文字前後
・会話 or 地の文あり
・ゆう必ず登場
・少し笑える
・最後に軽い引き

出力のみ
`;

    const res = await fetch(API_URL,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({prompt})
    });

    const data = await res.json();

    results.push(data.text);
  }

  document.getElementById("result").innerText =
    results.join("\n\n----------------\n\n");
}


// ===== 日常バズ投稿 =====
async function generateDaily(){

  const character = getCharacterDefinition();

  const templates = [
    "勘違い系",
    "現代ネタ",
    "哲学ボケ",
    "ゆうツッコミ強め",
    "SNSネタ"
  ];

  const type = templates[Math.floor(Math.random()*templates.length)];

  const prompt = `
${character}

【投稿タイプ】
日常バズ投稿

【テーマ】
${type}

【ルール】
・40〜80文字
・会話形式
・オチ必須
・テンポ重視

【バズ条件】
・共感 or クスっと笑い
・最後に落とす

出力のみ
`;

  const res = await fetch(API_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({prompt})
  });

  const data = await res.json();

  document.getElementById("result").innerText = data.text;
}


// ===== ボタン用 =====
async function generateTweet(){
  await generateStory5();
}

async function regenerate(){
  await generateStory5();
}


// ===== ServiceWorker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
