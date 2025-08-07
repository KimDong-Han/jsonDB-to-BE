interface JsonDate {
  $date: string; // ISO 8601 형식의 날짜 문자열
}

// JSON 파일 내의 비디오 객체에 대한 인터페이스
export interface VideoJson {
  title: string;
  url: string;
  iconImg: string;
  tag: string;
  uploadDate: JsonDate; // 위에서 정의한 JsonDate 타입 사용
}

export interface requestVideo {
  url: string;
}

export interface fancamJson extends VideoJson {
  churl: string;
  chName: string;
}
