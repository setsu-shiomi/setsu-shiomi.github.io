export type Work = {
  title: string;
  description: string;
  tags: string[];
  year: string;
  status: '公開' | '進行中' | '構想';
  repo?: string;
  url?: string;
};

export const works: Work[] = [
  {
    title: 'shirube（標）',
    description:
      'Linux デスクトップのための、ローカル完結 AI テキストアシスタント。選択したテキストをローカル LLM で要約・翻訳・校正する。RAG と whisper.cpp 音声入力にも対応。',
    tags: ['Rust', 'Wayland', 'niri', 'ローカルLLM', 'llama.cpp', 'whisper.cpp'],
    year: '2026',
    status: '公開',
    repo: 'https://github.com/setsu-shiomi/shirube',
  },
  {
    title: '内蔵GPUでローカルAIを動かす',
    description:
      'Radeon 860M（内蔵GPU）で llama.cpp を Vulkan 経由で動かす環境。消費電力を energy_now 差分で実測し、本当に動くのかを確かめる。',
    tags: ['Arch Linux', 'Vulkan', '省電力', 'llama.cpp'],
    year: '2026',
    status: '進行中',
  },
];
