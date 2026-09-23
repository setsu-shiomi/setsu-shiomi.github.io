---
title: '選択テキストをローカルLLMで処理する「shirube」を作った'
date: '2026-09-24'
description: 'テキストを選んでキーを押すと、手元のLLMが要約・翻訳・校正する。クラウドに送らない、Linuxデスクトップ向けのAIアシスタント「shirube」を Rust で作った話。'
---

テキストを選択して、キーを押す。すると、要約・翻訳・校正を**手元の LLM** がやってくれる。クラウドには何も送らない。

そういうツール「**shirube**（標）」を Rust で作った。

- GitHub: https://github.com/setsu-shiomi/shirube

## なぜ作ったか

便利な AI アシスタントはたくさんある。だが多くはクラウド前提で、選択したテキストはどこかのサーバに送られる。手元で動く LLM があるのに、それを使わないのはもったいない。

Wayland なら、**選択中のテキストを拾ってローカルサーバに流す**だけでいい。shirube はその配管を、使いやすい形にまとめたもの。

## できること

```sh
shirube actions            # 使えるアクション一覧
shirube run summarize      # 選択中のテキストを要約
shirube run translate --copy
shirube run proofread --notify

shirube tui                # 対話UI（アクション選択 → ストリーミング）
shirube ask --rag "質問"    # 手元の資料を根拠に回答
shirube voice              # 録音 → ローカル文字起こし → 処理
```

- 入力は **Wayland の primary selection**（ハイライトしたテキスト）。無ければクリップボード、無ければ stdin
- 出力はストリーミング。`--copy` でクリップボード、`--notify` で通知
- TUI（ratatui）、RAG（llama-embed）、音声入力（whisper.cpp）にも対応

## 仕組み

```text
選択テキスト
  → wl-paste（primary selection）
  → shirube（Rust）
  → llama-server（OpenAI 互換, localhost:8080）
  → ストリーミング表示 / クリップボード / 通知
```

shirube 自身はモデルを持たない。**OpenAI 互換のエンドポイントに繋ぐだけ**なので、llama.cpp でも何でもよい。

## niri 連携

`~/.config/niri/config.kdl` にキーバインドを足す。

```kdl
binds {
    Mod+Shift+A { spawn "foot" "--app-id=shirube" "-e" "shirube" "tui"; }
    Mod+Shift+G { spawn-sh "shirube run summarize --copy --notify"; }
    Mod+Shift+W { spawn "foot" "--app-id=shirube" "-e" "shirube" "voice"; }
}
```

文章を選んで `Mod+Shift+G` を押すだけで、要約がクリップボードと通知に入る。

## アクションは設定で増やせる

`~/.config/shirube/config.toml` に書く。アクションごとに**モデルも指定できる**ので、軽い処理は小さいモデル、重い処理は大きいモデルに振り分けられる。

```toml
[actions.summarize]
description = "要約する"
prompt = "次のテキストを日本語で簡潔に要約してください。\n\n---\n{input}"

[actions.deep]
description = "深く考える"
model = "Qwen3-30B-A3B-Instruct-2507-Q4_K_M.gguf"
prompt = "次の問いを多角的に検討してください。\n\n---\n{input}"
```

## 正直な制限

- **8B は遅い**（生成 6 t/s）。要約・翻訳のような「一気に出して終わり」なら許容範囲だが、長い対話には向かない
- 大きいモデル（MoE 30B・約18GB）は内蔵 GPU の共有メモリを圧迫し、**デスクトップが重くなる**
- ポップアップは今のところ `foot` のフローティング窓。**Wayland ネイティブの layer-shell 化**は今後の課題

## 作ってみて

「クラウドに送らない」だけで、心理的な抵抗がかなり減る。手元のモデルは遅いが、要約や校正には十分で、何より**自分のデータが自分のマシンから出ない**のが大きい。

コードは MIT で公開している。

- https://github.com/setsu-shiomi/shirube
