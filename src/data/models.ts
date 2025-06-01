// 실버홈 앱의 초기 데이터 모델 타입 정의

// 사용자 타입
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'resident' | 'family';
  password: string;
  phone: string; // 전화번호 추가
  address?: string;
  birthdate?: string;
  residentId?: string; // family 타입일 경우 연결된 resident의 id
  relatedResident?: string; // residentId와 동일한 용도, 호환성 유지
  emergencyContacts?: EmergencyContact[];
  healthData?: HealthData;
  applicationDate?: string; // 입주 신청일
  status?: 'pending' | 'approved' | 'rejected';
}

// 비상 연락처 타입
export interface EmergencyContact {
  id: string; // ID 추가
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  isFavorite: boolean;
}

// 건강 데이터 타입
export interface HealthData {
  id: string;
  userId: string;
  bloodPressure: BloodPressureRecord[];
  medications: Medication[];
}

// 혈압 측정 기록 타입
export interface BloodPressureRecord {
  id: string; // ID 추가
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
}

// 약 정보 타입
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  startDate: string;
  endDate: string;
}

// 도움 요청 카테고리 타입
export type RequestCategory = 'cleaning' | 'repair' | 'delivery' | 'it' | 'transportation' | 'other';

// 도움 요청 상태 타입
export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// 도움 요청 타입
export interface Request {
  id: string;
  userId: string;
  userName: string;
  category: RequestCategory;
  title: string;
  description: string;
  preferredDate?: string;
  preferredTime?: string;
  location: string;
  urgency?: 'low' | 'normal' | 'high';
  status: RequestStatus;
  createdAt: string;
  completedAt?: string | null;
  assignedTo?: string | null;
  feedback?: string | null;
}

// 일정 타입
export interface Schedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  description: string;
  category: string;
  time?: string; // 대체 시간 표시용 (일부 레거시 코드용)
}

// 메시지 타입
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
}

// 공지사항 타입
export interface Attachment {
  id?: string;
  name: string;
  url?: string;
  type?: string;
  size?: number;
}

export interface Notice {
  id: string;
  title: string;
  name?: string; // title과 동일한 용도, 호환성 유지
  content: string;
  createdAt: string;
  updatedAt?: string;
  category: string;
  isPinned?: boolean;
  author: string;
  authorId?: string;
  authorName?: string;
  attachments?: Attachment[];
}

// 시설 타입
export interface Facility {
  id: string;
  name: string;
  type: string;
  slots: string[];
  bookings: Booking[];
  imageUrl?: string;
  location?: string;
  capacity?: number;
  availableFrom?: string;
  availableTo?: string;
  description?: string;
}

// 입주 신청서 타입
export interface Application {
  id: string;
  name: string;
  phone: string;
  birthdate: string;
  idNumber: string;
  address: string;
  preferredDate: string;
  healthCondition: string;
  medicalHistory: string;
  emergencyContact: string;
  specialRequirements: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: string | null;
}

// 채팅방 타입
export interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'private';
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  roomId: string;
}

// 대화 타입
export interface Conversation {
  id: string;
  participants: string[];
  lastMessageTime: string;
  messages: Message[];
}

// 가족 연결 타입
export interface FamilyConnection {
  id: string;
  residentId: string;
  familyId: string;
  relationship: string;
  createdAt: string;
}

// 시설 예약 타입
export interface Booking {
  id: string;
  userId: string;
  userName: string;
  slot: string;
  date: string;
}

// 시설 예약 상세 타입
export interface Reservation {
  id: string;
  facilityId: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
}

// 긴급 호출 타입
export interface EmergencyCall {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  createdAt: string; // 호출 생성 시간
  status: 'pending' | 'processing' | 'completed';
  location?: string; // 호출 위치
  message?: string; // 추가 호출 메시지
  resolvedAt?: string; // 처리 완료 시간
  resolvedBy?: string; // 처리한 관리자 ID
  resolution?: string; // 처리 내용
}

// 앱 데이터 전체 타입
export interface AppData {
  users: User[];
  emergencyContacts: EmergencyContact[];
  healthData: HealthData[];
  requests: Request[];
  schedules: Schedule[];
  messages: Message[];
  notices: Notice[];
  facilities: Facility[];
  emergencyCalls: EmergencyCall[];
  applications: Application[];
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
  familyConnections: FamilyConnection[];
  reservations: Reservation[];
  conversations: Conversation[];
}

// 초기 데이터
export const initialData: AppData = {
  conversations: [
    {
      id: "conv-1",
      participants: ["resident-1", "family-1"],
      lastMessageTime: "2023-06-01T10:30:00.000Z",
      messages: [
        {
          id: "msg-1",
          senderId: "family-1",
          senderName: "김철수",
          content: "안녕하세요, 오늘 건강은 어떠세요?",
          timestamp: "2023-06-01T10:20:00.000Z",
          isRead: true
        },
        {
          id: "msg-2",
          senderId: "resident-1",
          senderName: "홍길동",
          content: "안녕, 오늘은 한강에서 산책했당. 너는 어땐니?",
          timestamp: "2023-06-01T10:30:00.000Z",
          isRead: false
        }
      ]
    }
  ],
  familyConnections: [
    {
      id: "connection-1",
      residentId: "resident-1",
      familyId: "family-1",
      relationship: "아들",
      createdAt: "2023-01-15T09:00:00.000Z"
    }
  ],
  reservations: [],
  users: [
    {
      id: "admin-1",
      name: "관리자",
      password: "admin123",
      role: "admin",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123"
    },
    {
      id: "resident-1",
      name: "홍길동",
      password: "resident123",
      role: "resident",
      phone: "010-8765-4321",
      address: "실버홈 101호",
      birthdate: "1955-05-15"
    },
    {
      id: "family-1",
      name: "김철수",
      password: "family123",
      role: "family",
      phone: "010-2222-3333",
      address: "서울시 서초구 반포대로 45",
      residentId: "resident-1"
    }
  ],
  emergencyContacts: [
    {
      id: "contact-1",
      userId: "resident-1",
      name: "김철수",
      relationship: "아들",
      phone: "010-2222-3333",
      isFavorite: true
    },
    {
      id: "contact-2",
      userId: "resident-1",
      name: "홍영희",
      relationship: "딸",
      phone: "010-3333-4444",
      isFavorite: false
    }
  ],
  healthData: [
    {
      id: "health-1",
      userId: "resident-1",
      bloodPressure: [
        {
          id: "bp-1",
          date: "2025-05-30",
          time: "09:00",
          systolic: 120,
          diastolic: 80,
          heartRate: 72
        }
      ],
      medications: [
        {
          id: "med-1",
          name: "혈압약",
          dosage: "5mg",
          schedule: ["아침", "저녁"],
          startDate: "2025-01-15",
          endDate: "2025-12-31"
        }
      ]
    }
  ],
  requests: [
    {
      id: "request-1",
      userId: "resident-1",
      userName: "홍길동",
      category: "cleaning",
      title: "방 청소 요청",
      description: "방 청소 부탁드립니다.",
      location: "301호",
      urgency: "normal",
      status: "pending",
      createdAt: "2025-05-31T10:00:00",
      completedAt: null,
      assignedTo: null,
      feedback: null
    }
  ],
  schedules: [
    {
      id: "schedule-1", 
      title: "아침 식사", 
      startTime: "08:00", 
      endTime: "09:00", 
      date: "2025-06-01",
      location: "식당",
      description: "아침 식사 시간입니다.",
      category: "health"
    },
    {
      id: "schedule-2", 
      title: "요가 수업", 
      startTime: "10:00", 
      endTime: "11:00", 
      date: "2025-06-01",
      location: "운동실",
      description: "초보자를 위한 요가 수업입니다.",
      category: "entertainment"
    }
  ],
  messages: [
    {
      id: "message-1",
      senderId: "resident-1",
      senderName: "홍길동",
      content: "안녕하세요!",
      timestamp: "2025-05-31T09:30:00"
    }
  ],
  notices: [
    {
      id: "notice-1",
      title: "6월 행사 안내",
      content: "6월 1일부터 여름맞이 행사가 시작됩니다. 많은 참여 바랍니다.",
      createdAt: "2025-05-31T10:00:00",
      category: "event",
      isPinned: true,
      author: "관리자"
    }
  ],
  facilities: [
    {
      id: "facility-1",
      name: "다목적 홀",
      type: "다목적홀",
      slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      bookings: [],
      imageUrl: "https://via.placeholder.com/300x200?text=다목적홀",
      location: "본관 1층",
      capacity: 50,
      availableFrom: "09:00",
      availableTo: "18:00",
      description: "다양한 행사와 모임을 진행할 수 있는 대형 공간입니다."
    },
    {
      id: "facility-2",
      name: "회의실 A",
      type: "회의실",
      slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      bookings: [],
      imageUrl: "https://via.placeholder.com/300x200?text=회의실A",
      location: "본관 2층",
      capacity: 15,
      availableFrom: "09:00",
      availableTo: "18:00",
      description: "소규모 회의나 모임을 위한 조용한 공간입니다."
    }
  ],
  emergencyCalls: [],
  applications: [],
  chatRooms: [
    {
      id: 'room-1',
      name: '실버홈 전체 채팅',
      type: 'group',
      participants: ['all'],
      lastMessage: '오늘 저녁 식단이 업데이트되었습니다.',
      lastMessageTime: '2025-05-31T15:30:00',
      unreadCount: 3
    },
    {
      id: 'room-2',
      name: '3층 주민 모임',
      type: 'group',
      participants: ['floor-3'],
      lastMessage: '내일 오후 3시 티타임 어떠세요?',
      lastMessageTime: '2025-05-31T12:45:00',
      unreadCount: 0
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      userId: 'admin-1',
      userName: '관리자',
      content: '안녕하세요, 실버홈 입주민 여러분!',
      timestamp: '2025-05-31T10:00:00',
      isRead: true,
      roomId: 'room-1'
    },
    {
      id: 'msg-2',
      userId: 'resident-1',
      userName: '홍길동',
      content: '안녕하세요~ 오늘 날씨가 정말 좋네요.',
      timestamp: '2025-05-31T10:05:00',
      isRead: true,
      roomId: 'room-1'
    }
  ]
};

// 로컬 스토리지에서 데이터 가져오기
export const getDataFromStorage = (): AppData => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('silverHomeData');
    return savedData ? JSON.parse(savedData) : initialData;
  }
  return initialData;
};

// 로컬 스토리지에 데이터 저장하기
export const saveDataToStorage = (data: AppData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('silverHomeData', JSON.stringify(data));
  }
};
