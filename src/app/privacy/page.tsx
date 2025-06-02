'use client'

export const runtime = 'edge';
export const regions = ['icn1'];
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-red-600 hover:text-red-800 font-medium">
              <FaArrowLeft className="mr-2" /> 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">개인정보처리방침</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실버홈은 이용자의 개인정보 보호를 최우선으로 생각합니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <article className="prose prose-gray prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              실버홈(이하 '회사'라 함)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 개인정보의 처리 목적</h2>
            <p>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">입주 계약 체결 및 관리</li>
              <li className="mb-2">입주자 건강 관리 및 의료 서비스 제공</li>
              <li className="mb-2">입주자 및 보호자 간 소통 지원</li>
              <li className="mb-2">서비스 개선 및 신규 서비스 개발</li>
              <li className="mb-2">불만처리 등 민원처리</li>
              <li className="mb-2">기타 원활한 양질의 서비스 제공</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. 개인정보의 처리 및 보유 기간</h2>
            <p className="mb-4">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">입주 계약 관련 정보: 계약 종료 후 5년</li>
              <li className="mb-2">의료 및 건강 관련 정보: 퇴소 후 10년</li>
              <li className="mb-2">재무 및 결제 정보: 계약 종료 후 5년</li>
              <li className="mb-2">서비스 이용 기록: 서비스 이용 종료 후 1년</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. 개인정보의 제3자 제공</h2>
            <p className="mb-4">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
            <p className="mb-4">
              다음과 같은 경우에 한해 개인정보를 제3자에게 제공합니다.
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">
                <strong>의료기관 제공</strong><br />
                - 제공받는 자: 협력 의료기관(종합병원, 전문병원 등)<br />
                - 제공 목적: 입주자 응급 의료 서비스 및 건강 관리<br />
                - 제공 항목: 성명, 생년월일, 성별, 건강정보, 의료보험정보<br />
                - 보유 기간: 의료서비스 제공 종료 시까지
              </li>
              <li className="mb-2">
                <strong>보험회사 제공</strong><br />
                - 제공받는 자: 손해보험사<br />
                - 제공 목적: 입주자 상해보험 가입 및 보험금 청구<br />
                - 제공 항목: 성명, 생년월일, 성별, 상해정보<br />
                - 보유 기간: 보험계약 종료 시까지
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. 정보주체와 법정대리인의 권리·의무 및 행사방법</h2>
            <p className="mb-4">
              정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            </p>
            <p className="mb-4">
              권리 행사는 회사에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
            </p>
            <p className="mb-4">
              권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수도 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. 처리하는 개인정보 항목</h2>
            <p className="mb-4">
              회사는 다음의 개인정보 항목을 처리하고 있습니다.
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">
                <strong>기본정보</strong><br />
                - 성명, 생년월일, 성별, 주소, 연락처, 이메일, 주민등록번호(법적 의무 이행 시에만)
              </li>
              <li className="mb-2">
                <strong>건강정보</strong><br />
                - 병력, 현재 복용 중인 약물, 알레르기 정보, 혈액형, 의료보험정보
              </li>
              <li className="mb-2">
                <strong>보호자정보</strong><br />
                - 성명, 관계, 연락처, 주소, 이메일
              </li>
              <li className="mb-2">
                <strong>결제정보</strong><br />
                - 계좌번호, 신용카드정보, 결제기록
              </li>
              <li className="mb-2">
                <strong>서비스 이용정보</strong><br />
                - 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. 개인정보의 파기</h2>
            <p className="mb-4">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <p className="mb-4">
              정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
            </p>
            <p className="mb-4">파기 절차 및 방법은 다음과 같습니다.</p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">
                <strong>파기절차</strong><br />
                회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
              </li>
              <li className="mb-2">
                <strong>파기방법</strong><br />
                전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. 개인정보의 안전성 확보조치</h2>
            <p className="mb-4">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
              <li className="mb-2">기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li className="mb-2">물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
            <p className="mb-4">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
            </p>
            <p className="mb-4">
              쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에게 보내는 소량의 정보이며 이용자의 PC 컴퓨터의 하드디스크에 저장되기도 합니다.
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-2">
                <strong>쿠키의 사용목적</strong><br />
                이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
              </li>
              <li className="mb-2">
                <strong>쿠키의 설치·운영 및 거부</strong><br />
                이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. 개인정보 보호책임자</h2>
            <p className="mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-1"><strong>▶ 개인정보 보호책임자</strong></p>
              <p className="mb-1">성명: 김정호</p>
              <p className="mb-1">직책: 개인정보보호팀장</p>
              <p className="mb-1">연락처: 02-123-4567, privacy@silverhome.com</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. 개인정보 처리방침 변경</h2>
            <p className="mb-4">
              이 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.
            </p>
            <p className="mb-4">
              이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">2024년 7월 1일 ~ 2024년 12월 31일 적용 (보기)</li>
              <li className="mb-2">2024년 1월 1일 ~ 2024년 6월 30일 적용 (보기)</li>
            </ul>

            <div className="mt-10">
              <p className="text-right">
                시행일: 2025년 1월 1일
              </p>
            </div>
          </article>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 실버홈. 모든 권리 보유.</p>
          <div className="mt-2 space-x-4">
            <Link href="/faq" className="text-gray-600 hover:text-red-600">자주 묻는 질문</Link>
            <Link href="/terms" className="text-gray-600 hover:text-red-600">이용약관</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-red-600 font-medium">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
