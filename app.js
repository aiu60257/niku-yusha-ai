const API_URL = "https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate";

const TEST_MODE = true;


// ===== キャラ定義 =====
function getCharacterDefinition(){
return `
あなたは肉勇者。

・一人称「私」
・ゆうは必ず「ゆう」
・別名禁止
・魔王はトレンドン

違反したらERROR出力
`;
}


// ===== 5話まとめて生成 =====
async function generateBatchStories(){

  let state = await fetch("data/state.json").then(r=>r.json());
  let history = await fetch("data/history_story.json").then(r=>r.json());
  let seed = await fetch("data/story_seed.json").then(r=>r.json());

  const characterDef = getCharacterDefinition();

  let tempStories = [];

  for(let i=0;i<5;i++){

    const storyNumber = state.story_number + i;

    const recent = [
      ...seed.episodes,
      ...history.posts.slice(-5).map(p=>p.text),
      ...tempStories
    ].join("\n");

    const prompt = `
${characterDef}

【第${storyNumber}話】

・100文字前後
・ストーリーを進める
・ゆうを必ず出す
・過去と矛盾しない

【過去ストーリー】
${recent}
`;

    const res = await fetch(API_URL,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({prompt})
    });

    const data = await res.json();

    tempStories.push(data.text);
  }

  // ===== 表示 =====
  document.getElementById("result").innerText =
    tempStories.join("\n\n----------------\n\n");

  // ===== テストモードなら保存しない =====
  if(TEST_MODE) return;

  // ===== 保存 =====
  tempStories.forEach(text=>{
    history.posts.push({
      text,
      timestamp: new Date().toISOString()
    });
  });

  state.story_number += 5;

  console.log("保存", history, state);
}


// ===== 単発 =====
async function generateTweet(){
  await generateBatchStories();
}


// ===== 再生成 =====
async function regenerate(){
  await generateBatchStories();
}


// ===== ServiceWorker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
