---
title: 'niri でローカルLLMをキー一発で呼び出す'
date: '2026-09-25'
description: '選択したテキストを、niri のキーバインドからローカルLLMに渡して要約・翻訳・校正する。クラウドに送らず、すべて手元で完結させる実践手順。'
---

文章を書いていて「これ要約したい」「英語にしたい」と思うたびに、ブラウザのタブを開いて AI にコピペするのは面倒だ。しかもその内容は、どこかのサーバに送られている。

**手元の LLM を使って、選択したテキストをその場で処理する。** これを niri のキー一発でやる手順をまとめる。

## ゴール

- テキストをハイライトして `Mod+Shift+G` → 要約がクリップボードと通知に入る
- `Mod+Shift+A` → アクションを選ぶ TUI が開く
- `Mod+Shift+W` → 音声入力から同じ流れへ
- すべてローカル完結

## 必要なもの

- niri（Wayland コンポジタ）
- `llama-server` が動いていること（OpenAI 互換 API）
- `wl-clipboard`、`libnotify`、`foot`

`llama-server` の起動例:

```sh
llama-server -m ~/ai/models/Qwen3-8B-Q4_K_M.gguf -c 8192 --jinja --port 8080
```

systemd のユーザーサービスにしておくと、ログイン後ずっと使えて便利だ。

## shirube を入れる

配管役は [shirube](https://github.com/setsu-shiomi/shirube)（Rust 製）。選択テキストを拾って、`llama-server` に流し、結果を返す。

```sh
git clone https://github.com/setsu-shiomi/shirube
cd shirube
cargo build --release
```

`~/.local/bin/shirube` にラッパーを置くと、どこからでも呼べる:

```sh
#!/usr/bin/env bash
exec "$HOME/Projects/shirube/target/release/shirube" "$@"
```

```sh
chmod +x ~/.local/bin/shirube
```

## niri にキーを割り当てる

`~/.config/niri/config.kdl` に追記する。

```kdl
// shirube のウィンドウをフローティングで開く
window-rule {
    match app-id=r#"^shirube$"#
    open-floating true
    default-column-width { proportion 0.6; }
    default-window-height { proportion 0.7; }
}

binds {
    // 選択テキストを要約して、クリップボードと通知へ
    Mod+Shift+G { spawn-sh "shirube run summarize --copy --notify"; }
    // アクション選択の TUI
    Mod+Shift+A { spawn "foot" "--app-id=shirube" "-e" "shirube" "tui"; }
    // 音声入力 → 文字起こし → 要約
    Mod+Shift+W { spawn "foot" "--app-id=shirube" "-e" "shirube" "voice" "--action" "summarize"; }
}
```

設定は自動でリロードされる。文法を確認したいときは:

```sh
niri validate
```

## 使う

1. ブラウザやエディタでテキストをハイライト
2. `Mod+Shift+G`
3. 数秒〜数十秒で、要約が**クリップボードに入り、通知で表示される**

翻訳したいときは `translate`、誤字を直したいときは `proofread` に変えるだけ。`shirube actions` で一覧が見られる。

## 応用

アクションは設定で増やせる（`~/.config/shirube/config.toml`）。アクションごとにモデルも指定できるので、軽い処理は小さいモデル、重い処理は大きいモデルに振り分けられる。

手元の資料を根拠に答えさせたいときは RAG:

```sh
shirube ask --rag "この端末の省電力設定は？"
```

## 正直な注意点

- **8B は遅い**（生成 6 t/s 程度）。要約・翻訳のような「一気に出して終わり」なら実用範囲だが、長い対話には向かない
- 大きいモデルは内蔵 GPU の共有メモリを圧迫し、**デスクトップが重くなる**
- TUI は今のところ `foot` のフローティング窓。ポップアップのネイティブ化は今後の課題

## まとめ

クラウドに送らず、選択テキストをその場で処理する環境は、思ったより簡単に作れる。キー一発で要約が手に入るのは、想像以上に快適だ。

コードは MIT で公開している。

- https://github.com/setsu-shiomi/shirube
