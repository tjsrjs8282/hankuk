import type { L } from "../i18n";

/**
 * Everything the homepage says, in Korean and English. The 2020 original's copy is
 * kept where it still works (tagline, slider line, library app, hot links, notices,
 * 성적 열람 문구) and its dates are brought forward to the 2026-27 academic year.
 * 한국대학교 is fictional — a portfolio piece — and the footer says so.
 */

/** A link that either scrolls to a section or asks the AI 도우미 a question. */
export type Target = { href: string } | { ask: L };

export const founded = 1956;

export const brand = {
  name: { ko: "한국대학교", en: "Hanguk University" },
  latin: "HANGUK UNIVERSITY",
  tagline: { ko: "함께 나누며 세상을 이끌어", en: "Sharing together, leading the world" },
  /** The last line is set in gold. */
  headline: { ko: "세계로 향하는\n한국대학교", en: "Toward the world,\nHanguk University" },
  intro: {
    ko: "개교 70주년. 은행나무길 끝 본관에서 시작한 배움이 이제 62개국 418개 대학으로 이어집니다.",
    en: "Seventy years on, the learning that began in our clock-tower hall now reaches 418 partner universities in 62 countries.",
  },
} satisfies Record<string, L | string>;

/** Top utility tabs from the 2020 header (대학교 · 입학안내 · 대학원). */
export const audiences: { label: L; target: Target }[] = [
  { label: { ko: "대학교", en: "University" }, target: { href: "#main" } },
  { label: { ko: "입학안내", en: "Admissions" }, target: { href: "#admission" } },
  { label: { ko: "대학원", en: "Graduate" }, target: { ask: { ko: "대학원 입학 안내해줘", en: "Tell me about graduate admissions" } } },
];

export type NavItem = { label: L; href: string; children: { label: L; target: Target }[] };

/** Main navigation (2020: 대학소개 · 학과소개 · 학사안내 · 대학생활 · 학생지원센터) — also the sitemap. */
export const nav: NavItem[] = [
  {
    label: { ko: "대학소개", en: "About" },
    href: "#about",
    children: [
      { label: { ko: "총장 인사말", en: "From the President" }, target: { href: "#about" } },
      { label: { ko: "숫자로 보는 한국대", en: "Hanguk in Numbers" }, target: { href: "#about" } },
      { label: { ko: "캠퍼스 맵", en: "Campus Map" }, target: { href: "#campus" } },
      { label: { ko: "찾아오시는 길", en: "Directions" }, target: { href: "#directions" } },
    ],
  },
  {
    label: { ko: "학과소개", en: "Academics" },
    href: "#colleges",
    children: [
      { label: { ko: "단과대학", en: "Colleges" }, target: { href: "#colleges" } },
      { label: { ko: "AI융합대학 (2027 신설)", en: "College of AI (new in 2027)" }, target: { href: "#colleges" } },
      { label: { ko: "대학원", en: "Graduate School" }, target: { ask: { ko: "대학원 입학 안내해줘", en: "Tell me about graduate admissions" } } },
      { label: { ko: "교환학생", en: "Exchange Programs" }, target: { ask: { ko: "교환학생은 어떻게 지원해?", en: "How do I apply for exchange?" } } },
    ],
  },
  {
    label: { ko: "학사안내", en: "Academic Affairs" },
    href: "#academic",
    children: [
      { label: { ko: "학사일정", en: "Academic Calendar" }, target: { href: "#academic" } },
      { label: { ko: "공지사항", en: "Notices" }, target: { href: "#notices" } },
      { label: { ko: "성적 열람·상담", en: "Grades & Advising" }, target: { ask: { ko: "성적 열람은 언제부터야?", en: "When can I see my grades?" } } },
      { label: { ko: "증명서 발급", en: "Certificates" }, target: { ask: { ko: "증명서는 어떻게 발급해?", en: "How do I get a certificate?" } } },
    ],
  },
  {
    label: { ko: "대학생활", en: "Campus Life" },
    href: "#life",
    children: [
      { label: { ko: "캠퍼스 갤러리", en: "Campus Gallery" }, target: { href: "#life" } },
      { label: { ko: "오늘의 학식", en: "Today's Menu" }, target: { href: "#life" } },
      { label: { ko: "SNS 소식", en: "SNS News" }, target: { href: "#life" } },
      { label: { ko: "홍보 영상", en: "Campus Film" }, target: { href: "#life" } },
    ],
  },
  {
    label: { ko: "학생지원센터", en: "Student Services" },
    href: "#support",
    children: [
      { label: { ko: "장학제도", en: "Scholarships" }, target: { ask: { ko: "장학금 종류 알려줘", en: "What scholarships are there?" } } },
      { label: { ko: "생활관(기숙사)", en: "Residence Halls" }, target: { ask: { ko: "기숙사 신청은 언제야?", en: "When is housing application?" } } },
      { label: { ko: "스마트 도서관", en: "Smart Library" }, target: { href: "#support" } },
      { label: { ko: "AI 도우미", en: "AI Assistant" }, target: { ask: { ko: "무엇을 물어볼 수 있어?", en: "What can I ask you?" } } },
    ],
  },
];

/** 2020's four hero circles: 증명서발급 · 장학제도 · 입학설명회 · 입학절차안내. */
export const quick: { icon: string; label: L; ask: L }[] = [
  { icon: "certificate", label: { ko: "증명서발급", en: "Certificates" }, ask: { ko: "증명서는 어떻게 발급해?", en: "How do I get a certificate?" } },
  { icon: "scholarship", label: { ko: "장학제도", en: "Scholarships" }, ask: { ko: "장학금 종류 알려줘", en: "What scholarships are there?" } },
  { icon: "session", label: { ko: "입학설명회", en: "Info Sessions" }, ask: { ko: "입학설명회는 언제 해?", en: "When is the admissions info session?" } },
  { icon: "steps", label: { ko: "입학절차안내", en: "How to Apply" }, ask: { ko: "정시 원서접수 일정은?", en: "When is the regular admission application?" } },
];

export type Story = { image: string; tag: L; title: L; text: L; cta: L; target: Target };

/** The 2020 slider repeated one slide four times; now four stories. */
export const stories: Story[] = [
  {
    image: "slide-admission",
    tag: { ko: "2027학년도 신입생 모집", en: "Class of 2031 admissions" },
    title: { ko: "한국에서 시작하는\n새로운 꿈", en: "A new dream\nthat starts in Korea" },
    text: { ko: "정시 원서접수 2026. 12. 29(화) – 12. 31(목)", en: "Regular admission applications: Dec 29–31, 2026" },
    cta: { ko: "모집요강 보기", en: "See the guide" },
    target: { href: "#admission" },
  },
  {
    image: "slide-global",
    tag: { ko: "글로벌 캠퍼스", en: "Global campus" },
    title: { ko: "62개국 418개 대학과\n함께 배웁니다", en: "Learning with 418\nuniversities in 62 countries" },
    text: { ko: "2027-1학기 교환학생 모집 · 11. 23(월) 서류 마감", en: "Spring 2027 exchange applications close Nov 23" },
    cta: { ko: "교환학생 안내", en: "Exchange programs" },
    target: { ask: { ko: "교환학생은 어떻게 지원해?", en: "How do I apply for exchange?" } },
  },
  {
    image: "slide-ai-lab",
    tag: { ko: "2027 신설", en: "New in 2027" },
    title: { ko: "AI융합대학,\n첫 신입생을 맞이합니다", en: "The College of AI\nwelcomes its first class" },
    text: { ko: "인공지능 · 데이터사이언스 · 지능형로봇 3개 학과 112명 선발", en: "112 places across AI, Data Science and Intelligent Robotics" },
    cta: { ko: "단과대학 보기", en: "See the colleges" },
    target: { href: "#colleges" },
  },
  {
    image: "slide-library",
    tag: { ko: "중앙도서관 리모델링", en: "Central Library, renewed" },
    title: { ko: "불이 꺼지지 않는\n24시간 도서관", en: "A library\nthat never sleeps" },
    text: { ko: "모바일 열람증 하나로 출입 · 좌석 예약 · 대출까지", en: "One mobile card for entry, seats and loans" },
    cta: { ko: "스마트 도서관", en: "Smart library" },
    target: { href: "#support" },
  },
];

/** 2020: "APP으로 스마트 도서관 바로이용하자!" */
export const libraryApp = {
  title: { ko: "APP으로\n스마트 도서관\n바로 이용하자!", en: "Use the\nsmart library\nright from the app" },
  text: { ko: "모바일 열람증은 도서관 자료실 · 도서 대출 · 좌석 예약에 사용할 수 있습니다.", en: "Your mobile card opens the stacks, checks out books and books a seat." },
  seats: { total: 1284 },
};

export type Notice = { cat: "notice" | "academic" | "admission" | "press"; title: L; date: string };

export const noticeTabs: { id: Notice["cat"]; label: L }[] = [
  { id: "notice", label: { ko: "공지", en: "News" } },
  { id: "academic", label: { ko: "학사", en: "Academic" } },
  { id: "admission", label: { ko: "입학", en: "Admissions" } },
  { id: "press", label: { ko: "보도", en: "Press" } },
];

export const notices: Notice[] = [
  { cat: "notice", date: "2026-10-30", title: { ko: "한국대학교 웹진 「HANKUK」 2026 가을호 발간", en: "HANKUK webzine, Autumn 2026 issue is out" } },
  { cat: "notice", date: "2026-10-28", title: { ko: "개교 70주년 기념식 및 홈커밍데이 안내", en: "70th anniversary ceremony and homecoming day" } },
  { cat: "notice", date: "2026-10-26", title: { ko: "2026학년도 2학기 기말고사 시행 안내", en: "Fall 2026 final exam schedule" } },
  { cat: "notice", date: "2026-10-21", title: { ko: "중앙도서관 24시간 열람실 운영 확대", en: "24-hour reading rooms extended at the Central Library" } },
  { cat: "academic", date: "2026-11-02", title: { ko: "2026-2학기 성적 열람 및 상담 신청 안내", en: "Fall 2026 grade viewing and advising requests" } },
  { cat: "academic", date: "2026-10-29", title: { ko: "2026-2학기 수업평가 실시 안내", en: "Fall 2026 course evaluations" } },
  { cat: "academic", date: "2026-10-27", title: { ko: "2027학년도 1학기 휴·복학 신청 일정", en: "Spring 2027 leave and return applications" } },
  { cat: "academic", date: "2026-10-22", title: { ko: "겨울 계절학기 수강신청 안내", en: "Winter session course registration" } },
  { cat: "admission", date: "2026-11-01", title: { ko: "2027학년도 정시모집 입학설명회 개최", en: "Regular admission info session for 2027" } },
  { cat: "admission", date: "2026-10-23", title: { ko: "2027학년도 정시모집 요강 발표", en: "2027 regular admission guide published" } },
  { cat: "admission", date: "2026-10-20", title: { ko: "2027학년도 편입학 모집요강 안내", en: "2027 transfer admission guide" } },
  { cat: "admission", date: "2026-10-15", title: { ko: "수시모집 합격자 발표 일정 안내", en: "Early admission results: announcement dates" } },
  { cat: "press", date: "2026-10-31", title: { ko: "한국대, 2026 대학평가 교육혁신 부문 '우수대학' 선정", en: "Hanguk rated 'Excellent' for teaching innovation in 2026" } },
  { cat: "press", date: "2026-10-24", title: { ko: "AI융합대학 2027학년도 신설 확정", en: "College of AI confirmed to open in 2027" } },
  { cat: "press", date: "2026-10-16", title: { ko: "신소재공학과 연구팀, 차세대 배터리 소재 국제학술지 게재", en: "Materials team publishes next-gen battery research" } },
  { cat: "press", date: "2026-10-08", title: { ko: "외국인 유학생 2,300명 돌파… 글로벌 캠퍼스 가속", en: "International students pass 2,300" } },
];

export type CalEvent = { start: string; end?: string; kind: "academic" | "exam" | "admission" | "event" | "break"; title: L };

/** 2026-2학기 ~ 2027-1학기 개강. Dates are fictional apart from the national CSAT day. */
export const calendar: CalEvent[] = [
  { start: "2026-09-01", kind: "academic", title: { ko: "2026학년도 2학기 개강", en: "Fall 2026 semester begins" } },
  { start: "2026-09-01", end: "2026-09-07", kind: "academic", title: { ko: "수강신청 변경 기간", en: "Add/drop period" } },
  { start: "2026-10-19", end: "2026-10-23", kind: "exam", title: { ko: "2학기 중간고사", en: "Midterm exams" } },
  { start: "2026-10-28", end: "2026-10-30", kind: "event", title: { ko: "가을 축제 「한빛제」", en: "Hanbit autumn festival" } },
  { start: "2026-11-05", end: "2026-11-13", kind: "academic", title: { ko: "성적 열람 및 상담 신청 (중간)", en: "Midterm grade viewing & advising" } },
  { start: "2026-11-16", end: "2026-11-20", kind: "academic", title: { ko: "겨울 계절학기 수강신청", en: "Winter session registration" } },
  { start: "2026-11-16", end: "2026-11-27", kind: "admission", title: { ko: "대학원 전기 2차 원서접수", en: "Graduate school, 2nd round" } },
  { start: "2026-11-19", kind: "break", title: { ko: "대학수학능력시험 (휴강)", en: "National CSAT day (no classes)" } },
  { start: "2026-11-23", kind: "academic", title: { ko: "2027-1 교환학생 서류 마감", en: "Spring 2027 exchange deadline" } },
  { start: "2026-11-25", kind: "event", title: { ko: "개교 70주년 기념식 · 홈커밍데이", en: "70th anniversary · homecoming" } },
  { start: "2026-11-30", end: "2026-12-02", kind: "academic", title: { ko: "교환학생 선발 면접", en: "Exchange interviews" } },
  { start: "2026-12-01", end: "2026-12-11", kind: "academic", title: { ko: "2학기 수업평가", en: "Course evaluations" } },
  { start: "2026-12-05", kind: "admission", title: { ko: "정시모집 입학설명회", en: "Regular admission info session" } },
  { start: "2026-12-11", kind: "admission", title: { ko: "수시모집 합격자 발표", en: "Early admission results" } },
  { start: "2026-12-14", end: "2026-12-18", kind: "exam", title: { ko: "2학기 기말고사", en: "Final exams" } },
  { start: "2026-12-21", kind: "break", title: { ko: "동계방학 시작", en: "Winter break begins" } },
  { start: "2026-12-22", end: "2027-01-12", kind: "academic", title: { ko: "겨울 계절학기", en: "Winter session" } },
  { start: "2026-12-24", end: "2026-12-30", kind: "academic", title: { ko: "2학기 성적 열람 및 이의신청", en: "Fall grades & appeals" } },
  { start: "2026-12-29", end: "2026-12-31", kind: "admission", title: { ko: "2027학년도 정시모집 원서접수", en: "Regular admission applications" } },
  { start: "2027-01-05", end: "2027-01-08", kind: "admission", title: { ko: "2027학년도 편입학 원서접수", en: "Transfer applications" } },
  { start: "2027-01-18", end: "2027-01-22", kind: "academic", title: { ko: "2027-1학기 휴·복학 신청", en: "Spring 2027 leave/return" } },
  { start: "2027-01-25", end: "2027-01-29", kind: "academic", title: { ko: "2027-1학기 생활관 입사 신청", en: "Spring 2027 housing applications" } },
  { start: "2027-02-02", kind: "admission", title: { ko: "정시모집 합격자 발표", en: "Regular admission results" } },
  { start: "2027-02-09", end: "2027-02-13", kind: "academic", title: { ko: "2027-1학기 수강신청", en: "Spring 2027 registration" } },
  { start: "2027-02-19", kind: "event", title: { ko: "2026학년도 학위수여식", en: "Commencement 2026" } },
  { start: "2027-02-25", end: "2027-02-26", kind: "event", title: { ko: "신입생 오리엔테이션", en: "Freshman orientation" } },
  { start: "2027-03-02", kind: "academic", title: { ko: "2027학년도 입학식 · 1학기 개강", en: "Entrance ceremony · Spring 2027 begins" } },
];

export const calendarKinds: Record<CalEvent["kind"], L> = {
  academic: { ko: "학사", en: "Academic" },
  exam: { ko: "시험", en: "Exams" },
  admission: { ko: "입학", en: "Admissions" },
  event: { ko: "행사", en: "Events" },
  break: { ko: "휴업", en: "Break" },
};

/** 2020's vertical "성적 열람 및 상담 신청" ticker. */
export const ticker: { title: L; text: L }[] = [
  {
    title: { ko: "2026-2학기 성적 열람 및 상담 신청", en: "Fall 2026 grades & advising" },
    text: { ko: "성적 열람 및 상담 신청은 본인이 수강한 교과목 수업평가를 모두 마친 후 확인할 수 있습니다.", en: "Grades open once you have finished the evaluation for every course you took." },
  },
  {
    title: { ko: "2026-2학기 수업평가", en: "Fall 2026 course evaluations" },
    text: { ko: "12. 1(화) – 12. 11(금) 포털에서 참여할 수 있으며, 미참여 시 성적 열람이 제한됩니다.", en: "Dec 1–11 on the portal. Skipping it delays your grades." },
  },
  {
    title: { ko: "겨울 계절학기 수강신청", en: "Winter session registration" },
    text: { ko: "11. 16(월) – 11. 20(금) · 최대 6학점까지 신청할 수 있습니다.", en: "Nov 16–20 · up to 6 credits." },
  },
];

/** 2020 HOT LINK: 숙박시설 운영 · 편리시설 제공 · 학식최고 쉐프 */
export const hotLinks: { icon: string; label: L; ask: L }[] = [
  { icon: "dorm", label: { ko: "생활관", en: "Housing" }, ask: { ko: "기숙사 신청은 언제야?", en: "When is housing application?" } },
  { icon: "cafe", label: { ko: "편의시설", en: "Amenities" }, ask: { ko: "학생회관에 뭐가 있어?", en: "What's in the student union?" } },
  { icon: "chef", label: { ko: "학식", en: "Dining" }, ask: { ko: "오늘 학식 뭐야?", en: "What's on today's menu?" } },
];

export type Meal = { main: L; sides: L };
export type DayMenu = { lunch: Meal; dinner: Meal | null };

/** Weekly menu, Monday → Friday. Weekends: closed. 천원의 아침밥 runs every weekday. */
export const menu: DayMenu[] = [
  {
    lunch: { main: { ko: "제육볶음 정식", en: "Spicy pork bulgogi set" }, sides: { ko: "잡곡밥 · 된장찌개 · 계란말이 · 깍두기", en: "Multigrain rice · doenjang stew · rolled omelette · kkakdugi" } },
    dinner: { main: { ko: "치킨마요덮밥", en: "Chicken mayo rice bowl" }, sides: { ko: "미소국 · 단무지 · 샐러드", en: "Miso soup · pickled radish · salad" } },
  },
  {
    lunch: { main: { ko: "돈까스 & 크림파스타", en: "Pork cutlet & cream pasta" }, sides: { ko: "양배추샐러드 · 콘수프 · 피클", en: "Cabbage salad · corn soup · pickles" } },
    dinner: { main: { ko: "김치볶음밥", en: "Kimchi fried rice" }, sides: { ko: "계란프라이 · 어묵국 · 깍두기", en: "Fried egg · fish-cake soup · kkakdugi" } },
  },
  {
    lunch: { main: { ko: "쉐프 특선 한우국밥", en: "Chef's special beef gukbap" }, sides: { ko: "고등어구이 · 시금치나물 · 배추김치", en: "Grilled mackerel · spinach namul · kimchi" } },
    dinner: { main: { ko: "짜장면 & 탕수육", en: "Jjajangmyeon & sweet-sour pork" }, sides: { ko: "짬뽕국물 · 단무지", en: "Spicy broth · pickled radish" } },
  },
  {
    lunch: { main: { ko: "춘천식 닭갈비", en: "Chuncheon-style dakgalbi" }, sides: { ko: "쌀밥 · 콩나물국 · 감자조림 · 김치", en: "Rice · bean-sprout soup · braised potatoes · kimchi" } },
    dinner: { main: { ko: "우동 & 유부초밥", en: "Udon & inari sushi" }, sides: { ko: "튀김 · 단무지", en: "Tempura · pickled radish" } },
  },
  {
    lunch: { main: { ko: "전주식 비빔밥", en: "Jeonju-style bibimbap" }, sides: { ko: "떡갈비 · 계란국 · 열무김치", en: "Tteokgalbi · egg soup · young-radish kimchi" } },
    dinner: null,
  },
];

export const dining = {
  place: { ko: "학생회관 2층 학생식당", en: "Student Union, 2F" },
  price: "₩5,500",
  breakfast: { ko: "천원의 아침밥 08:00–09:30", en: "₩1,000 breakfast, 8:00–9:30" },
  hours: { lunch: "11:30–13:30", dinner: "17:30–18:50" },
};

export const sns = {
  image: "festival-night",
  title: { ko: "가을 축제 「한빛제」", en: "Hanbit Festival" },
  text: {
    ko: "사흘 동안 2만 명이 다녀간 은행나무길 무대. 다음 축제에서 만나요!",
    en: "Twenty thousand of you came to the stage on Ginkgo Road. See you next year!",
  },
  date: "2026-10-30",
  channels: ["instagram", "youtube", "kakaotalk", "naver"] as const,
};

/**
 * Four frames of the same view (generated against one reference, so the hall and the
 * boulevard line up) — the 사계절 section cross-fades between them.
 */
export const seasons: { image: string; name: L; month: L; caption: L }[] = [
  { image: "season-spring", name: { ko: "봄", en: "Spring" }, month: { ko: "4월", en: "April" }, caption: { ko: "벚꽃이 흩날리는 은행나무길, 새내기들의 첫 등굣길", en: "Cherry blossoms on Ginkgo Road — freshmen's first walk to class" } },
  { image: "season-summer", name: { ko: "여름", en: "Summer" }, month: { ko: "7월", en: "July" }, caption: { ko: "짙은 초록 그늘 아래 계절학기와 동아리 공연", en: "Summer session and club shows in deep green shade" } },
  { image: "season-autumn", name: { ko: "가을", en: "Autumn" }, month: { ko: "11월", en: "November" }, caption: { ko: "600m 은행나무길이 노랗게 물드는 한국대의 계절", en: "Six hundred metres of gold — Hanguk's own season" } },
  { image: "season-winter", name: { ko: "겨울", en: "Winter" }, month: { ko: "1월", en: "January" }, caption: { ko: "첫눈 쌓인 본관 계단, 불 켜진 시계탑", en: "First snow on the steps, the clock tower lit" } },
];

export const admission = {
  title: { ko: "2027학년도\n신·편입생 모집", en: "Now admitting\nfreshmen & transfers" },
  deadline: "2026-12-29T09:00:00+09:00",
  schedule: [
    { label: { ko: "정시 원서접수", en: "Regular" }, date: { ko: "2026. 12. 29(화) – 12. 31(목)", en: "Dec 29–31, 2026" } },
    { label: { ko: "편입학 원서접수", en: "Transfer" }, date: { ko: "2027. 1. 5(화) – 1. 8(금)", en: "Jan 5–8, 2027" } },
  ],
  cta: { ko: "입학 사전예약", en: "Pre-register" },
  ask: { ko: "정시 원서접수 일정은?", en: "When is the regular admission application?" },
};

export const president = {
  name: { ko: "총장 한 지 원", en: "President Han Ji-won" },
  quote: {
    ko: "일흔 해 전, 은행나무 몇 그루와 강의실 하나로 시작한 한국대학교는 이제 2만 학생이 세계와 만나는 캠퍼스가 되었습니다. 다음 일흔 해도 함께 나누며 세상을 이끌겠습니다.",
    en: "Seventy years ago Hanguk began with a few ginkgo trees and a single lecture hall. Today twenty thousand students meet the world here. For the next seventy, we will keep sharing — and keep leading.",
  },
};

export const stats: { value: number; suffix: L; label: L; decimals?: number }[] = [
  { value: 70, suffix: { ko: "주년", en: " yrs" }, label: { ko: "1956년 개교", en: "Founded 1956" } },
  { value: 21480, suffix: { ko: "명", en: "" }, label: { ko: "재학생", en: "Students" } },
  { value: 2316, suffix: { ko: "명", en: "" }, label: { ko: "외국인 유학생 · 58개국", en: "International students · 58 countries" } },
  { value: 418, suffix: { ko: "개교", en: "" }, label: { ko: "자매대학 · 62개국", en: "Partner universities · 62 countries" } },
  { value: 32, suffix: { ko: "개", en: "" }, label: { ko: "학과·전공 · 8개 단과대학", en: "Programs · 8 colleges" } },
  { value: 74.6, suffix: { ko: "%", en: "%" }, label: { ko: "취업률 (2025 졸업생)", en: "Employment, class of 2025" }, decimals: 1 },
];

export type College = { icon: string; name: L; en: string; isNew?: boolean; majors: L[] };

export const colleges: College[] = [
  {
    icon: "book",
    name: { ko: "인문대학", en: "Humanities" },
    en: "College of Humanities",
    majors: [
      { ko: "국어국문학과", en: "Korean Language & Literature" },
      { ko: "영어영문학과", en: "English Language & Literature" },
      { ko: "사학과", en: "History" },
      { ko: "철학과", en: "Philosophy" },
    ],
  },
  {
    icon: "people",
    name: { ko: "사회과학대학", en: "Social Sciences" },
    en: "College of Social Sciences",
    majors: [
      { ko: "행정학과", en: "Public Administration" },
      { ko: "경제학과", en: "Economics" },
      { ko: "심리학과", en: "Psychology" },
      { ko: "미디어커뮤니케이션학과", en: "Media & Communication" },
    ],
  },
  {
    icon: "chart",
    name: { ko: "경영대학", en: "Business" },
    en: "College of Business",
    majors: [
      { ko: "경영학과", en: "Business Administration" },
      { ko: "회계학과", en: "Accounting" },
      { ko: "국제통상학과", en: "International Trade" },
      { ko: "빅데이터경영학과", en: "Big-Data Management" },
    ],
  },
  {
    icon: "atom",
    name: { ko: "자연과학대학", en: "Natural Sciences" },
    en: "College of Natural Sciences",
    majors: [
      { ko: "수학과", en: "Mathematics" },
      { ko: "물리학과", en: "Physics" },
      { ko: "화학과", en: "Chemistry" },
      { ko: "생명과학과", en: "Life Sciences" },
    ],
  },
  {
    icon: "gear",
    name: { ko: "공과대학", en: "Engineering" },
    en: "College of Engineering",
    majors: [
      { ko: "기계공학과", en: "Mechanical Engineering" },
      { ko: "전자공학과", en: "Electronic Engineering" },
      { ko: "신소재공학과", en: "Materials Science" },
      { ko: "건축학과", en: "Architecture" },
    ],
  },
  {
    icon: "chip",
    name: { ko: "AI융합대학", en: "AI Convergence" },
    en: "College of AI Convergence",
    isNew: true,
    majors: [
      { ko: "인공지능학과", en: "Artificial Intelligence" },
      { ko: "데이터사이언스학과", en: "Data Science" },
      { ko: "지능형로봇학과", en: "Intelligent Robotics" },
      { ko: "AI·인문융합전공", en: "AI & Humanities (minor)" },
    ],
  },
  {
    icon: "palette",
    name: { ko: "예술디자인대학", en: "Arts & Design" },
    en: "College of Arts & Design",
    majors: [
      { ko: "시각디자인학과", en: "Visual Design" },
      { ko: "산업디자인학과", en: "Industrial Design" },
      { ko: "영상애니메이션학과", en: "Film & Animation" },
      { ko: "실용음악과", en: "Contemporary Music" },
    ],
  },
  {
    icon: "globe",
    name: { ko: "글로벌융합학부", en: "Global Studies" },
    en: "Division of Global Studies",
    majors: [
      { ko: "한국학전공", en: "Korean Studies" },
      { ko: "국제관계전공", en: "International Relations" },
      { ko: "K-콘텐츠전공", en: "K-Content" },
      { ko: "글로벌비즈니스전공", en: "Global Business" },
    ],
  },
];

export type Spot = { id: string; x: number; y: number; name: L; text: L };

/** Hotspots on the illustrated campus map (percent of the image). */
export const spots: Spot[] = [
  { id: "hall", x: 47.8, y: 30, name: { ko: "본관", en: "Main Hall" }, text: { ko: "1956년 개교와 함께 지어진 시계탑 건물. 총장실 · 입학처 · 학사지원팀이 있습니다.", en: "The 1956 clock-tower hall: President's office, Admissions and Academic Affairs." } },
  { id: "library", x: 17, y: 42, name: { ko: "중앙도서관", en: "Central Library" }, text: { ko: "장서 210만 권, 24시간 열람실 1,284석과 그룹스터디룸 32실.", en: "2.1 million volumes, 1,284 seats open 24/7 and 32 group-study rooms." } },
  { id: "dorm", x: 25, y: 15, name: { ko: "생활관", en: "Residence Halls" }, text: { ko: "3개 동 2,400명 수용. 편의점 · 세탁실 · 체력단련실.", en: "Three towers for 2,400 students, with a store, laundry and gym." } },
  { id: "eng", x: 66, y: 16, name: { ko: "공학관 · AI융합관", en: "Engineering & AI Halls" }, text: { ko: "AI 컴퓨팅센터와 로봇연구실. 2027년 AI융합대학이 입주합니다.", en: "AI computing center and robotics labs — home of the new College of AI." } },
  { id: "gym", x: 84, y: 33, name: { ko: "체육관", en: "Gymnasium" }, text: { ko: "실내체육관 · 25m 수영장 · 클라이밍월.", en: "Indoor arena, 25 m pool and climbing wall." } },
  { id: "field", x: 87.5, y: 47, name: { ko: "대운동장", en: "Stadium" }, text: { ko: "천연잔디 축구장과 400m 트랙. 졸업 사진 명소.", en: "Grass pitch and 400 m track — a favorite graduation photo spot." } },
  { id: "union", x: 70.5, y: 60, name: { ko: "학생회관", en: "Student Union" }, text: { ko: "학생식당 · 카페 · 동아리방 · 은행 · 우체국. 천원의 아침밥은 2층에서.", en: "Dining hall, café, club rooms, bank and post office. ₩1,000 breakfast on 2F." } },
  { id: "plaza", x: 47.8, y: 50, name: { ko: "중앙광장", en: "Central Plaza" }, text: { ko: "분수대가 있는 광장. 축제와 학위수여식이 열립니다.", en: "The fountain plaza, where festivals and commencement happen." } },
  { id: "pond", x: 25.5, y: 67, name: { ko: "한빛연못 · 정자", en: "Hanbit Pond & Pavilion" }, text: { ko: "시험 기간에 가장 붐비는 쉼터.", en: "The busiest place to breathe during exam week." } },
  { id: "road", x: 47.8, y: 68, name: { ko: "은행나무길", en: "Ginkgo Road" }, text: { ko: "정문에서 본관까지 600m. 11월이면 노랗게 물듭니다.", en: "600 m from the gate to the hall, golden every November." } },
  { id: "gate", x: 47.5, y: 84, name: { ko: "정문", en: "Main Gate" }, text: { ko: "셔틀버스 정류장 · 방문자 안내소.", en: "Shuttle stop and visitor center." } },
];

export const directions = {
  address: { ko: "서울특별시 구로구 구로로 300 (구로동)", en: "300 Guro-ro, Guro-gu, Seoul" },
  routes: [
    { mode: { ko: "지하철", en: "Subway" }, text: { ko: "1호선 구로역 3번 출구 → 도보 10분", en: "Line 1 Guro Stn. exit 3 → 10 min walk" } },
    { mode: { ko: "셔틀버스", en: "Shuttle" }, text: { ko: "2호선 구로디지털단지역 5번 출구 → 정문 (08:00–19:00, 10분 간격)", en: "Line 2 Guro Digital Complex exit 5 → main gate (8am–7pm, every 10 min)" } },
    { mode: { ko: "버스", en: "Bus" }, text: { ko: "간선 503 · 지선 6515 '한국대 정문' 하차", en: "Bus 503 or 6515, stop 'Hanguk Univ. Main Gate'" } },
  ],
};

/** 2020 footer: 회사소개 · 한국대학교 · 개인정보취급방침 · 이용정책 · 입점/제휴문의 및 광고 · 이메일 무단수집거부 */
export const footerLinks: L[] = [
  { ko: "대학소개", en: "About" },
  { ko: "개인정보처리방침", en: "Privacy" },
  { ko: "이용약관", en: "Terms" },
  { ko: "이메일무단수집거부", en: "No email harvesting" },
  { ko: "웹 접근성 정책", en: "Accessibility" },
];

export const contact = {
  phone: "1234-5678",
  fax: "02-1234-5678",
  email: "hello@hanguk.example",
};
