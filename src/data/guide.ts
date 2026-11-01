import type { L } from "../i18n";

/**
 * The AI 도우미's knowledge — one entry per topic. On GitHub Pages the assistant
 * answers straight from these entries (src/scripts/assistant.ts matches the question
 * to `keys`); on the Vercel build the same entries become Gemini's facts, so both
 * modes say the same thing. Tokens in answers are filled in at answer time:
 *   {dday}  days until 정시 원서접수 opens   {menu}  today's menu
 */
export type GuideLink = { label: L; href?: string; ask?: L };
export type GuideEntry = { id: string; keys: string[]; q: L; a: L; links?: GuideLink[] };

const toCalendar: GuideLink = { label: { ko: "학사일정 보기", en: "Open the calendar" }, href: "#academic" };

export const guide: GuideEntry[] = [
  {
    id: "regular",
    keys: ["정시", "원서", "원서접수", "입시", "입학절차", "지원방법", "수능", "모집요강", "regular", "apply", "application", "admission", "deadline"],
    q: { ko: "정시 원서접수 일정은?", en: "When is the regular admission application?" },
    a: {
      ko: "2027학년도 정시모집 원서접수는 2026년 12월 29일(화) 09:00부터 12월 31일(목) 18:00까지 온라인으로 받아요. 접수 시작까지 {dday} 남았어요.\n가·나군 모두 수능 위주로 선발하고, 합격자는 2027년 2월 2일(화)에 발표합니다. 모집요강은 공지사항 '입학' 탭에서 볼 수 있어요.",
      en: "Applications for the 2027 regular admission open online on Tuesday, December 29, 2026 at 9:00 and close on Thursday, December 31 at 18:00 — {dday} to go.\nSelection is based mainly on the CSAT, and results come out on February 2, 2027. The full guide is under the Admissions tab in Notices.",
    },
    links: [{ label: { ko: "모집 일정 보기", en: "See the admission dates" }, href: "#admission" }, toCalendar],
  },
  {
    id: "transfer",
    keys: ["편입", "편입학", "transfer", "transfer admission"],
    q: { ko: "편입학은 언제 지원해?", en: "When are transfer applications?" },
    a: {
      ko: "2027학년도 편입학 원서접수는 2027년 1월 5일(화)부터 8일(금)까지예요. 일반편입은 2학년 이상 수료(4학기 이상, 64학점 이상) 또는 전문대 졸업(예정)자가 지원할 수 있어요.",
      en: "Transfer applications for 2027 run from January 5 to 8, 2027. You need at least four semesters and 64 credits completed, or a junior-college degree (or expected degree).",
    },
    links: [toCalendar],
  },
  {
    id: "early",
    keys: ["수시", "합격", "합격자", "발표", "early", "result"],
    q: { ko: "수시 합격자 발표는 언제야?", en: "When are early admission results?" },
    a: {
      ko: "수시모집 최초 합격자는 2026년 12월 11일(금) 17:00에 입학처 홈페이지에서 발표해요. 정시 합격자 발표는 2027년 2월 2일(화)입니다.",
      en: "Early admission results are posted on Friday, December 11, 2026 at 17:00. Regular admission results follow on February 2, 2027.",
    },
    links: [toCalendar],
  },
  {
    id: "session",
    keys: ["설명회", "입학설명회", "입학상담", "상담회", "info session", "open day", "session"],
    q: { ko: "입학설명회는 언제 해?", en: "When is the admissions info session?" },
    a: {
      ko: "2027학년도 정시모집 입학설명회는 2026년 12월 5일(토) 14:00 본관 대강당에서 열리고, 유튜브로도 생중계해요. 설명회 뒤에는 단과대학별 1:1 상담 부스가 운영됩니다. 사전 신청 없이 참석할 수 있어요.",
      en: "The regular admission info session is on Saturday, December 5, 2026 at 14:00 in the Main Hall auditorium, streamed live on YouTube too. One-on-one advising booths for each college follow. No registration needed.",
    },
    links: [toCalendar],
  },
  {
    id: "certificate",
    keys: ["증명서", "재학증명", "졸업증명", "성적증명", "발급", "certificate", "transcript", "enrollment"],
    q: { ko: "증명서는 어떻게 발급해?", en: "How do I get a certificate?" },
    a: {
      ko: "재학·졸업·성적증명서는 포털의 '증명서 발급'에서 PDF로 바로 받을 수 있어요(1통 1,000원, 재학생은 학기당 3통 무료). 본관 1층 무인발급기는 평일 09:00–18:00에 운영하고, 영문 증명서도 같은 곳에서 발급됩니다.",
      en: "Enrollment, graduation and transcript certificates download instantly as PDFs from the portal (₩1,000 each; current students get three free per semester). The kiosk on the Main Hall ground floor works weekdays 9:00–18:00, and issues English versions too.",
    },
  },
  {
    id: "scholarship",
    keys: ["장학", "장학금", "국가장학", "등록금", "학비", "scholarship", "tuition", "financial"],
    q: { ko: "장학금 종류 알려줘", en: "What scholarships are there?" },
    a: {
      ko: "대표적으로 ① 입학·재학 성적우수 장학 ② 국가장학금 연계 장학 ③ 교내 근로장학 ④ 교환학생 글로벌 장학 ⑤ 개교 70주년 '한빛 장학'(가계 곤란 학생 등록금 전액)이 있어요. 재학생의 68%가 한 가지 이상 장학금을 받습니다.\n2027-1학기 국가장학금은 한국장학재단 1차 신청 기간(11월 말–12월)에 꼭 신청해 주세요.",
      en: "Main options: (1) merit scholarships for entrants and current students, (2) national-scholarship matching, (3) campus work-study, (4) global scholarships for exchange students and (5) the 70th-anniversary Hanbit Scholarship, which covers full tuition for students in financial need. 68% of students receive at least one.\nFor spring 2027, apply for the national scholarship during KOSAF's first round (late November–December).",
    },
  },
  {
    id: "dorm",
    keys: ["기숙사", "생활관", "숙박", "기숙", "입사", "housing", "dorm", "residence"],
    q: { ko: "기숙사 신청은 언제야?", en: "When is housing application?" },
    a: {
      ko: "2027-1학기 생활관 입사 신청은 2027년 1월 25일(월)–29일(금)에 포털에서 받아요. 3개 동 2,400명 규모이고, 2인실 기준 학기당 1,280,000원(식비 별도)이에요. 신입생은 합격 후 안내 메일로 따로 신청합니다.",
      en: "Spring 2027 housing applications are open January 25–29, 2027 on the portal. Three towers house 2,400 students; a double room is ₩1,280,000 per semester (meals extra). Incoming freshmen apply through the email they get after admission.",
    },
    links: [{ label: { ko: "캠퍼스 맵에서 보기", en: "Show on the campus map" }, href: "#campus" }],
  },
  {
    id: "dining",
    keys: ["학식", "식당", "메뉴", "밥", "점심", "저녁", "아침", "식단", "천원", "menu", "lunch", "dinner", "breakfast", "cafeteria", "dining", "food"],
    q: { ko: "오늘 학식 뭐야?", en: "What's on today's menu?" },
    a: {
      ko: "{menu}\n학생식당은 학생회관 2층, 1식 5,500원이에요. 평일 아침 08:00–09:30에는 '천원의 아침밥'도 있어요.",
      en: "{menu}\nThe dining hall is on the 2nd floor of the Student Union, ₩5,500 a meal. On weekdays there's also a ₩1,000 breakfast from 8:00 to 9:30.",
    },
    links: [{ label: { ko: "오늘의 학식 보기", en: "See today's menu" }, href: "#life" }],
  },
  {
    id: "library",
    keys: ["도서관", "열람실", "좌석", "대출", "열람증", "책", "library", "seat", "book", "study room"],
    q: { ko: "도서관 운영시간은?", en: "What are the library hours?" },
    a: {
      ko: "중앙도서관 24시간 열람실(1,284석)은 연중무휴예요. 자료실은 평일 09:00–22:00, 주말 10:00–17:00에 열고, 그룹스터디룸 32실은 앱에서 예약해요. 앱의 모바일 열람증 하나로 출입·좌석 배정·대출을 모두 할 수 있어요.",
      en: "The Central Library's 24-hour reading rooms (1,284 seats) never close. The stacks open weekdays 9:00–22:00 and weekends 10:00–17:00, and the 32 group-study rooms are booked in the app — whose mobile card handles entry, seats and loans.",
    },
    links: [{ label: { ko: "스마트 도서관", en: "Smart library" }, href: "#support" }],
  },
  {
    id: "exchange",
    keys: ["교환", "교환학생", "해외", "유학", "자매대학", "어학연수", "exchange", "abroad", "study abroad", "partner"],
    q: { ko: "교환학생은 어떻게 지원해?", en: "How do I apply for exchange?" },
    a: {
      ko: "2027-1학기 교환학생 서류 마감은 2026년 11월 23일(월)이고, 면접은 11월 30일–12월 2일이에요. 62개국 418개 자매대학 중에서 지원할 수 있고, 영어권은 TOEFL iBT 80 또는 IELTS 6.0 이상이 필요해요. 선발되면 글로벌 장학금도 신청할 수 있습니다.",
      en: "Spring 2027 exchange applications close on Monday, November 23, 2026, with interviews from November 30 to December 2. Choose from 418 partners in 62 countries; English-taught destinations ask for TOEFL iBT 80 or IELTS 6.0. Selected students can apply for a global scholarship.",
    },
    links: [toCalendar],
  },
  {
    id: "grades",
    keys: ["성적", "학점", "이의신청", "수업평가", "grade", "gpa", "evaluation"],
    q: { ko: "성적 열람은 언제부터야?", en: "When can I see my grades?" },
    a: {
      ko: "2학기 성적 열람 및 이의신청은 2026년 12월 24일(목)–30일(수)이에요. 성적은 수강한 모든 교과목의 수업평가(12월 1일–11일)를 마친 뒤에 열람할 수 있어요.",
      en: "Fall grades and appeals open December 24–30, 2026. You'll see them once you've completed the evaluation for every course (December 1–11).",
    },
    links: [toCalendar],
  },
  {
    id: "exams",
    keys: ["시험", "기말", "중간고사", "기말고사", "학사일정", "개강", "종강", "방학", "입학식", "졸업식", "학위수여식", "exam", "final", "semester", "break", "calendar", "commencement"],
    q: { ko: "기말고사는 언제야?", en: "When are finals?" },
    a: {
      ko: "2학기 기말고사는 2026년 12월 14일(월)–18일(금)이고, 동계방학은 12월 21일(월)에 시작해요. 학위수여식은 2027년 2월 19일(금), 2027학년도 입학식과 1학기 개강은 3월 2일(화)입니다.",
      en: "Fall finals run December 14–18, 2026, and winter break starts December 21. Commencement is February 19, 2027; the entrance ceremony and spring semester start on March 2.",
    },
    links: [toCalendar],
  },
  {
    id: "leave",
    keys: ["휴학", "복학", "leave", "leave of absence", "return"],
    q: { ko: "휴학 신청은 언제 해?", en: "When do I apply for a leave?" },
    a: {
      ko: "2027-1학기 휴·복학 신청은 2027년 1월 18일(월)–22일(금)에 포털에서 해요. 군 휴학은 입영일 기준으로 수시로 신청할 수 있어요.",
      en: "Leave and return applications for spring 2027 run January 18–22, 2027 on the portal. Military leave can be filed any time based on your enlistment date.",
    },
    links: [toCalendar],
  },
  {
    id: "registration",
    keys: ["수강신청", "수강", "계절학기", "registration", "register", "course", "winter session"],
    q: { ko: "수강신청 기간 알려줘", en: "When is course registration?" },
    a: {
      ko: "겨울 계절학기 수강신청은 2026년 11월 16일(월)–20일(금)이고 최대 6학점까지예요(수업 12월 22일–1월 12일). 2027-1학기 수강신청은 2027년 2월 9일(화)–13일(토)입니다.",
      en: "Winter session registration is November 16–20, 2026, up to 6 credits (classes December 22 – January 12). Spring 2027 registration runs February 9–13, 2027.",
    },
    links: [toCalendar],
  },
  {
    id: "graduate",
    keys: ["대학원", "석사", "박사", "graduate", "master", "phd", "doctoral"],
    q: { ko: "대학원 입학 안내해줘", en: "Tell me about graduate admissions" },
    a: {
      ko: "2027학년도 전기 일반대학원 2차 모집 원서접수는 2026년 11월 16일(월)–27일(금)이에요. 34개 석·박사 과정이 있고, AI융합대학과 함께 'AI융합전공' 석사과정도 2027년에 처음 신입생을 받아요.",
      en: "Second-round applications for the spring 2027 graduate school run November 16–27, 2026. There are 34 master's and doctoral programs, and the new AI Convergence master's takes its first students in 2027.",
    },
    links: [toCalendar],
  },
  {
    id: "colleges",
    keys: ["학과", "전공", "단과대학", "ai융합", "인공지능", "major", "college", "program", "department"],
    q: { ko: "어떤 학과가 있어?", en: "What programs are there?" },
    a: {
      ko: "8개 단과대학, 32개 학과·전공이 있어요. 2027학년도에는 AI융합대학이 새로 문을 열고 인공지능학과 · 데이터사이언스학과 · 지능형로봇학과에서 112명을 처음 선발합니다.",
      en: "There are 32 programs across 8 colleges. In 2027 the new College of AI Convergence opens with 112 places in Artificial Intelligence, Data Science and Intelligent Robotics.",
    },
    links: [{ label: { ko: "단과대학 보기", en: "See the colleges" }, href: "#colleges" }],
  },
  {
    id: "events",
    keys: ["축제", "한빛제", "행사", "70주년", "기념식", "홈커밍", "festival", "anniversary", "event"],
    q: { ko: "개교 70주년 행사는 언제야?", en: "When is the 70th anniversary?" },
    a: {
      ko: "개교 70주년 기념식은 2026년 11월 25일(수) 11:00 중앙광장에서 열리고, 같은 날 오후 홈커밍데이가 이어져요. 가을 축제 「한빛제」는 10월 28–30일에 2만 명과 함께 마쳤어요.",
      en: "The 70th anniversary ceremony is on Wednesday, November 25, 2026 at 11:00 in the Central Plaza, followed by homecoming in the afternoon. The Hanbit autumn festival wrapped up October 28–30 with 20,000 visitors.",
    },
    links: [toCalendar],
  },
  {
    id: "amenities",
    keys: ["편의", "편의시설", "학생회관", "카페", "은행", "우체국", "편의점", "amenities", "cafe", "student union"],
    q: { ko: "학생회관에 뭐가 있어?", en: "What's in the student union?" },
    a: {
      ko: "학생회관에는 학생식당(2층) · 카페 두 곳 · 편의점 · 은행 · 우체국 · 동아리방 120실이 있어요. 생활관에도 편의점과 세탁실, 체력단련실이 있습니다.",
      en: "The Student Union has the dining hall (2F), two cafés, a convenience store, a bank, a post office and 120 club rooms. The residence halls add a store, laundry and a gym.",
    },
    links: [{ label: { ko: "캠퍼스 맵에서 보기", en: "Show on the campus map" }, href: "#campus" }],
  },
  {
    id: "directions",
    keys: ["오시는", "찾아오", "위치", "주소", "교통", "지하철", "버스", "셔틀", "주차", "directions", "address", "subway", "bus", "shuttle", "where"],
    q: { ko: "학교에 어떻게 가?", en: "How do I get to campus?" },
    a: {
      ko: "주소는 서울특별시 구로구 구로로 300이에요. 지하철 1호선 구로역 3번 출구에서 걸어서 10분, 2호선 구로디지털단지역 5번 출구에서는 정문행 셔틀버스(08:00–19:00, 10분 간격)를 타면 돼요. 방문 차량은 정문 안내소에서 주차권을 받아 주세요.",
      en: "We're at 300 Guro-ro, Guro-gu, Seoul. It's a 10-minute walk from exit 3 of Guro Station (Line 1), or take the shuttle from exit 5 of Guro Digital Complex (Line 2) — every 10 minutes, 8am–7pm. Visitors with cars get a parking pass at the main gate.",
    },
    links: [{ label: { ko: "찾아오시는 길", en: "Directions" }, href: "#directions" }],
  },
  {
    id: "webzine",
    keys: ["웹진", "hankuk 가을호", "가을호", "webzine", "magazine"],
    q: { ko: "웹진 가을호에는 뭐가 실렸어?", en: "What's in the autumn webzine?" },
    a: {
      ko: "웹진 「HANKUK」 2026 가을호는 개교 70주년 특집이에요. 1956년 첫 입학생 인터뷰, AI융합대학 신설 이야기, 은행나무길 600m의 사계절 화보가 실렸어요. 포털 첫 화면과 중앙도서관 1층에서 볼 수 있어요.",
      en: "The Autumn 2026 HANKUK webzine is a 70th-anniversary issue: an interview with a member of the first class of 1956, the story of the new College of AI, and a four-seasons photo essay on Ginkgo Road. Find it on the portal or on the Central Library's ground floor.",
    },
    links: [{ label: { ko: "사계절 본관 보기", en: "See the four seasons" }, href: "#seasons" }],
  },
  {
    id: "ranking",
    keys: ["대학평가", "우수대학", "평가", "선정", "ranking", "rated", "excellent"],
    q: { ko: "대학평가 결과가 어때?", en: "How did Hanguk rate?" },
    a: {
      ko: "한국대는 2026 대학평가 교육혁신 부문에서 '우수대학'으로 선정됐어요. 학생 설계 전공, AI 튜터 기반 기초교육, 1:1 진로 상담 제도가 높은 점수를 받았습니다.",
      en: "Hanguk was rated 'Excellent' for teaching innovation in the 2026 evaluation, with high marks for student-designed majors, AI-tutored foundation courses and one-to-one career advising.",
    },
  },
  {
    id: "research",
    keys: ["연구", "연구팀", "배터리", "학술지", "논문", "research", "battery", "paper"],
    q: { ko: "최근 연구 성과 알려줘", en: "Any recent research news?" },
    a: {
      ko: "신소재공학과 연구팀이 충전 속도를 크게 높인 차세대 배터리 음극 소재를 개발해 국제학술지에 게재했어요. 학부생 3명이 공동저자로 참여했고, 연구는 공학관 에너지소재연구실에서 진행됐습니다.",
      en: "A Materials Science team published a next-generation battery anode that charges much faster; three undergraduates are co-authors. The work came out of the Energy Materials Lab in the Engineering Hall.",
    },
    links: [{ label: { ko: "단과대학 보기", en: "See the colleges" }, href: "#colleges" }],
  },
  {
    id: "international",
    keys: ["유학생", "외국인", "international student", "foreign", "global campus"],
    q: { ko: "외국인 유학생은 얼마나 돼?", en: "How many international students are there?" },
    a: {
      ko: "외국인 유학생이 58개국 2,316명으로 처음 2,300명을 넘었어요. 글로벌라운지에서 한국어 튜터링과 버디 프로그램을 운영하고, 영어로만 진행하는 강의도 140개가 넘습니다.",
      en: "International enrolment passed 2,300 for the first time — 2,316 students from 58 countries. The Global Lounge runs Korean tutoring and a buddy program, and more than 140 courses are taught entirely in English.",
    },
    links: [{ label: { ko: "교환학생 안내", en: "Exchange programs" }, ask: { ko: "교환학생은 어떻게 지원해?", en: "How do I apply for exchange?" } }],
  },
  {
    id: "contact",
    keys: ["전화", "연락처", "문의", "이메일", "팩스", "contact", "phone", "email", "call"],
    q: { ko: "문의는 어디로 해?", en: "Who do I contact?" },
    a: {
      ko: "대표전화는 1234-5678(평일 09:00–18:00), 팩스 02-1234-5678이에요. 입학 문의는 대표전화에서 1번을 누르면 입학처로 연결돼요.",
      en: "Call 1234-5678 (weekdays 9:00–18:00) or fax 02-1234-5678. For admissions, press 1 to reach the Admissions Office.",
    },
  },
  {
    id: "help",
    keys: ["도움", "뭘", "무엇을", "뭐 물어", "할 수", "기능", "누구", "가상", "실제", "진짜", "help", "what can", "who are you", "real", "fictional", "fake"],
    q: { ko: "무엇을 물어볼 수 있어?", en: "What can I ask you?" },
    a: {
      ko: "입학(정시·편입·설명회), 학사일정과 성적, 장학금, 생활관, 오늘의 학식, 도서관, 교환학생, 오시는 길을 물어보세요. 참고로 한국대학교는 포트폴리오용으로 만든 가상의 대학이라, 일정과 숫자도 모두 가상이에요.",
      en: "Ask me about admissions (regular, transfer, info sessions), the calendar and grades, scholarships, housing, today's menu, the library, exchange or directions. Note that Hanguk University is a fictional school made for a portfolio, so its dates and numbers are fictional too.",
    },
  },
  {
    id: "hello",
    keys: ["안녕", "반가", "하이", "hello", "hi", "hey"],
    q: { ko: "안녕!", en: "Hi!" },
    a: {
      ko: "안녕하세요! 한국대 AI 도우미예요. 입학, 학사, 장학, 캠퍼스 생활 무엇이든 물어보세요.",
      en: "Hello! I'm Hanguk's AI assistant. Ask me anything about admissions, academics, scholarships or campus life.",
    },
  },
];

export const fallback: L = {
  ko: "그 질문은 아직 제가 정확히 답하기 어려워요. 대표전화 1234-5678(평일 09:00–18:00)로 문의하시거나, 아래 질문 중에서 골라 보세요.",
  en: "I can't answer that one reliably yet. Please call 1234-5678 (weekdays 9:00–18:00), or try one of the questions below.",
};

/** Suggestion chips shown when the panel opens. */
export const suggestions = ["regular", "scholarship", "dining", "certificate", "dorm", "library"];
