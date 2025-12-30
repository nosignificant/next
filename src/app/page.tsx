import { redirect } from "next/navigation";

export default async function HomePage() {

    redirect("/note"); 
  

  // 4. 글이 하나도 없을 때만 이 화면이 나옵니다.
  return (
    <div className="flex items-center justify-center h-[50vh] text-neutral-400 px-20 text-center leading-loose font-light text-sm">
      雲散霧消는 Rain World를 플레이한 후 게임의 가능성에 빠졌다.<br/> 
      기계, 자연, 생물의 조화를 탐구한다. 
    </div>
  );
}