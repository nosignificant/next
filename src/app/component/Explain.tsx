// src/app/component/Explain.tsx

export default function Explain() {
  return (
    <div className="flex flex-col gap-4">
      <img 
        className="w-[60px] h-auto object-contain" 
        src="/favicon.ico" 
        alt="Favicon Icon"
      />
      
      <div className="text-neutral-800 leading-[26px] tracking-tighter break-keep">
        雲散霧消는 Rain World를 플레이한 후 게임의 가능성에 빠졌다.
        <br />
        기계, 자연, 생물의 조화를 탐구한다.
      </div>

      <div className="flex items-center gap-4 text-[13px] font-medium">
        <a
          href="https://github.com/nosignificant"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-800 transition-all"
        >
          GitHub
        </a>
        <a
          href="https://www.instagram.com/gonewithmind/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-800 transition-all"
        >
          Instagram
        </a>
      </div>
    </div>
  );
}