async function generateTweet(){

document.getElementById("result").innerText =
"テスト：肉勇者はまだ動かない";

}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
