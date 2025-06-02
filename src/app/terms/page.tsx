'use client'

export const runtime = 'edge';
export const regions = ['icn1'];
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">이용약관</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실버홈 서비스 이용에 관한 약관입니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <article className="prose prose-gray prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">제 1 장 총칙</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 1 조 (목적)</h3>
            <p>
              이 약관은 실버홈(이하 "회사"라 함)이 제공하는 노인복지주택 입주 및 서비스(이하 "서비스"라 함) 이용에 관한 
              조건 및 절차, 회사와 이용자 간의 권리와 의무, 책임사항 등 기본적인 사항을 규정함을 목적으로 합니다.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 2 조 (용어의 정의)</h3>
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>"입주자"</strong>란 회사가 제공하는 주거 공간 및 서비스를 이용하기 위해 계약을 체결한 개인을 말합니다.
              </li>
              <li className="mb-2">
                <strong>"보호자"</strong>란 입주자의 가족 또는 법정대리인으로서 입주자를 대신하여 계약을 체결하거나 입주자의 
                권익을 대변할 수 있는 자를 말합니다.
              </li>
              <li className="mb-2">
                <strong>"계약"</strong>이란 회사가 제공하는 주거 공간 및 서비스를 이용하기 위해 입주자 또는 보호자와 체결하는 
                입주 계약을 말합니다.
              </li>
              <li className="mb-2">
                <strong>"이용료"</strong>란 입주자가 서비스 이용의 대가로 회사에 지불하는 비용을 말합니다.
              </li>
              <li className="mb-2">
                <strong>"시설"</strong>이란 회사가 서비스를 제공하기 위해 운영하는 건물, 설비, 기타 부대시설을 말합니다.
              </li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 3 조 (약관의 효력 및 변경)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
              </li>
              <li className="mb-2">
                회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 시행일로부터 적용됩니다.
              </li>
              <li className="mb-2">
                회사는 약관을 변경할 경우, 변경 내용과 시행일을 명시하여 시행일로부터 최소 30일 전에 공지합니다.
              </li>
              <li className="mb-2">
                이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 계약을 해지할 수 있습니다.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">제 2 장 입주 계약</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 4 조 (계약의 성립)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                입주 계약은 입주자 또는 보호자가 회사의 입주 신청서를 작성하고 회사가 이를 승인함으로써 성립합니다.
              </li>
              <li className="mb-2">
                회사는 입주 신청에 대한 심사를 진행할 수 있으며, 필요한 경우 추가 자료를 요청할 수 있습니다.
              </li>
              <li className="mb-2">
                입주자 또는 보호자는 계약 체결 시 회사가 요구하는 정보를 정확히 제공해야 합니다.
              </li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 5 조 (계약 기간)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                입주 계약의 기본 기간은 1년이며, 계약 만료 1개월 전까지 별도의 의사표시가 없으면 자동으로 1년 연장됩니다.
              </li>
              <li className="mb-2">
                단기 입주의 경우, 최소 계약 기간은 3개월이며 양 당사자의 합의에 따라 결정됩니다.
              </li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 6 조 (이용료 및 납부)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                이용료는 입주자가 선택한 주거 유형 및 서비스 옵션에 따라 결정됩니다.
              </li>
              <li className="mb-2">
                이용료는 매월 지정된 날짜에 선불로 납부해야 하며, 납부 방법은 계약서에 명시된 방법을 따릅니다.
              </li>
              <li className="mb-2">
                회사는 물가 상승, 시설 개선, 서비스 품질 향상 등을 이유로 이용료를 조정할 수 있으며, 
                조정 시에는 최소 2개월 전에 입주자 또는 보호자에게 통지합니다.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">제 3 장 서비스 이용</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 7 조 (서비스 내용)</h3>
            <p>회사가 제공하는 기본 서비스는 다음과 같습니다.</p>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">주거 공간 제공</li>
              <li className="mb-2">식사 서비스(1일 3식)</li>
              <li className="mb-2">청소 및 세탁 서비스</li>
              <li className="mb-2">기본 건강 관리</li>
              <li className="mb-2">여가 및 문화 프로그램</li>
              <li className="mb-2">안전 관리 및 응급 상황 대응</li>
            </ol>
            <p>
              추가 서비스는 선택에 따라 별도 비용이 발생할 수 있으며, 상세 내용은 입주 계약서 또는 회사 안내문에 따릅니다.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 8 조 (입주자의 권리와 의무)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                입주자는 회사가 제공하는 서비스를 이용할 권리를 가집니다.
              </li>
              <li className="mb-2">
                입주자는 시설 내 공용 공간과 설비를 이용할 수 있습니다.
              </li>
              <li className="mb-2">
                입주자는 다른 입주자의 권리를 존중하고 시설 내 질서를 유지해야 합니다.
              </li>
              <li className="mb-2">
                입주자는 시설물을 훼손하지 않도록 주의하여야 하며, 고의 또는 중대한 과실로 시설물을 훼손한 경우 
                이에 대한 배상 책임을 집니다.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">제 4 장 계약 해지 및 환불</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 9 조 (계약 해지)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                입주자 또는 보호자는 1개월 전에 회사에 서면으로 통지함으로써 계약을 해지할 수 있습니다.
              </li>
              <li className="mb-2">
                회사는 입주자가 다음 각 호에 해당하는 경우 계약을 해지할 수 있습니다.
                <ul className="list-disc pl-6 mt-2">
                  <li>이용료를 2회 이상 연체한 경우</li>
                  <li>타 입주자의 안전이나 권리를 심각하게 침해하는 경우</li>
                  <li>의료적 필요성으로 인해 시설 내 거주가 부적합하다고 판단되는 경우</li>
                  <li>기타 계약서에 명시된 해지 사유에 해당하는 경우</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 10 조 (환불 규정)</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                입주 후 2주 이내에 계약을 해지하는 경우, 이용료의 80%를 환불합니다.
              </li>
              <li className="mb-2">
                입주 후 1개월 이내에 계약을 해지하는 경우, 이용료의 50%를 환불합니다.
              </li>
              <li className="mb-2">
                입주 후 1개월 이상 경과 후 계약을 해지하는 경우, 잔여 계약 기간에 비례하여 환불하되, 
                중도 해지 수수료 10%를 공제합니다.
              </li>
              <li className="mb-2">
                입주자의 사망, 중대한 질병 등 불가항력적 사유로 계약이 해지되는 경우, 
                중도 해지 수수료 없이 잔여 계약 기간에 비례하여 환불합니다.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">제 5 장 기타</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 11 조 (면책사항)</h3>
            <p>
              회사는 다음 각 호의 사유로 인한 손해에 대해서는 책임을 지지 않습니다.
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">천재지변, 전쟁, 폭동 등 불가항력적인 사유로 인한 서비스 중단</li>
              <li className="mb-2">입주자의 고의 또는 과실로 인한 사고 또는 손해</li>
              <li className="mb-2">입주자가 회사의 안내나 주의사항을 무시하여 발생한 손해</li>
              <li className="mb-2">입주자가 소지한 귀중품 또는 현금의 도난, 분실</li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 12 조 (분쟁해결)</h3>
            <p>
              이 약관에 명시되지 않은 사항 또는 약관의 해석에 관한 분쟁은 관련 법령 및 상관습에 따르며, 
              필요한 경우 양 당사자의 합의하에 조정이나 중재를 통해 해결할 수 있습니다.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">제 13 조 (관할법원)</h3>
            <p>
              이 약관에 관한 분쟁이 발생하여 소송이 제기되는 경우, 회사의 본점 소재지를 관할하는 법원을 
              제1심 관할법원으로 합니다.
            </p>

            <div className="mt-10">
              <p className="text-right">
                부칙<br />
                이 약관은 2025년 1월 1일부터 시행합니다.
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
            <Link href="/terms" className="text-gray-600 hover:text-red-600 font-medium">이용약관</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-red-600">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
