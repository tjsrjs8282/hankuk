export type Lang = "ko" | "en";

/** A string in both languages. Content lives in src/data as `L` values. */
export type L = { ko: string; en: string };

export const t = (l: L, lang: Lang) => l[lang];

export const langFrom = (locale: string | undefined): Lang => (locale === "en" ? "en" : "ko");

/** Interface strings that are not content (labels, controls, announcements). */
export const ui = {
  skip: { ko: "본문으로 건너뛰기", en: "Skip to content" },
  menu: { ko: "전체메뉴", en: "Menu" },
  close: { ko: "닫기", en: "Close" },
  sitemap: { ko: "사이트맵", en: "Sitemap" },
  directions: { ko: "찾아오시는 길", en: "Directions" },
  langSwitch: { ko: "ENGLISH", en: "한국어" },
  langSwitchLabel: { ko: "영어 페이지로 이동", en: "Switch to Korean" },
  fontSize: { ko: "글자크기", en: "Text size" },
  fontSmaller: { ko: "글자 작게", en: "Smaller text" },
  fontLarger: { ko: "글자 크게", en: "Larger text" },
  fontReset: { ko: "기본 크기로", en: "Reset text size" },
  fontAnnounce: { ko: "글자 크기 {n}%", en: "Text size {n}%" },
  login: { ko: "통합로그인", en: "Sign in" },
  mainNav: { ko: "주 메뉴", en: "Main menu" },
  utilNav: { ko: "유틸리티 메뉴", en: "Utility menu" },
  more: { ko: "더보기", en: "More" },
  detail: { ko: "자세히 보기", en: "Learn more" },
  prev: { ko: "이전", en: "Previous" },
  next: { ko: "다음", en: "Next" },
  pause: { ko: "일시정지", en: "Pause" },
  play: { ko: "재생", en: "Play" },
  slide: { ko: "슬라이드", en: "slide" },
  of: { ko: "/", en: "of" },
  videoPause: { ko: "배경 영상 일시정지", en: "Pause background video" },
  videoPlay: { ko: "배경 영상 재생", en: "Play background video" },
  scroll: { ko: "스크롤", en: "Scroll" },
  toTop: { ko: "맨 위로", en: "Back to top" },
  demo: {
    ko: "포트폴리오용으로 만든 가상의 대학교 홈페이지라 실제 계정·페이지는 없어요.",
    en: "This is a fictional university built as a portfolio piece, so there is no real account or page behind this link.",
  },
  newBadge: { ko: "새 글", en: "New" },
  today: { ko: "오늘", en: "Today" },
} satisfies Record<string, L>;
