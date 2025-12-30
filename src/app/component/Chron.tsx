import type { Post } from "../lib/type";

// Post 타입에 표시 여부 props를 추가해서 받습니다.
interface ChronProps extends Post {
  showYear: boolean;
  showMonth: boolean;
}

export default function Chron({ publishedAt, showYear, showMonth }: ChronProps) {
  // 데이터 파싱
  const year = publishedAt.substring(0, 4);
  const month = publishedAt.substring(5, 7);
  const day = publishedAt.substring(8, 10);

  return (
    <div className="flex font-pretendard items-center text-neutral-400 text-xs">
      {/* 1. 연도 영역 (w-10 고정) */}
      {/* showYear가 false면 invisible로 투명하게 처리 -> 공간은 유지됨 */}
      <div className={`w-10 px-1 transition-opacity ${showYear ? "text-neutral-500 font-medium" : "invisible"}`}>
        {year}
      </div>

      {/* 2. 월 영역 (w-8 고정, 우측 정렬) */}
      <div className={`w-10 px-1 text-right ${showMonth ? "text-neutral-500" : "invisible"}`}>
        {parseInt(month)}월
      </div>


      <div className="w-10 px-1 text-right">
        {parseInt(day)}일
      </div>
    </div>
  );
}