import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-900 to-green-600 text-white text-center px-10 py-10">
          <h1 className="text-3xl font-bold mb-2">개인정보 처리방침</h1>
          <p className="text-sm opacity-90">최종 업데이트: 2025년 7월 11일</p>
        </div>
        <div className="px-8 py-10 leading-relaxed text-justify">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              1. 개인정보 수집 및 이용목적
            </h2>
            <p className="mb-4 text-md">
              대방은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
              개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
              목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의
              동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>서비스 제공 및 계약의 체결·이행</li>
              <li>회원 관리 및 본인확인</li>
              <li>마케팅 및 광고 활용</li>
              <li>서비스 개선 및 새로운 서비스 개발</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              2. 수집하는 개인정보의 항목
            </h2>
            <p className="mb-4 text-md">
              대방은 회원가입, 서비스 이용, 상담 등을 위해 아래와 같은
              개인정보를 수집하고 있습니다.
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-green-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  필수정보
                </h3>
                <p>이름, 이메일 주소, 비밀번호</p>
              </div>
              <div className="bg-blue-50 border border-green-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  선택정보
                </h3>
                <p>휴대폰 번호, 주소, 관심 지역</p>
              </div>
              <div className="bg-blue-50 border border-green-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  자동 수집정보
                </h3>
                <p>IP주소, 쿠키, 방문일시, 서비스 이용 기록, 불량 이용 기록</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p className="mb-4">
              대방은 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당
              정보를 지체 없이 파기합니다.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong className="text-green-900">회원정보:</strong> 회원 탈퇴
                시까지 (단, 관계법령에 따라 보존 필요시 해당 기간)
              </li>
              <li>
                <strong className="text-green-900">서비스 이용기록:</strong> 3년
              </li>
              <li>
                <strong className="text-green-900">문의 및 상담 기록:</strong>{" "}
                3년
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="mb-4">
              대방은 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한
              범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 목적
              범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
            </p>
            <p className="mb-2">다만, 다음의 경우에는 예외로 합니다:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>정보주체로부터 별도의 동의를 받은 경우</li>
              <li>
                법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여
                불가피한 경우
              </li>
              <li>
                정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 경우 등 긴급
                상황
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              5. 개인정보 처리 위탁
            </h2>
            <p className="mb-4">
              대방은 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
              처리업무를 위탁하고 있습니다.
            </p>
            <div className="bg-blue-50 border border-green-600 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                웹 서비스 배포 및 운영
              </h3>
              <p>
                <strong className="text-green-600">수탁업체:</strong> Vercel,
                Inc.
              </p>
              <p>
                <strong className="text-green-600">위탁업무:</strong> 웹 서비스
                배포 및 운영 인프라 제공
              </p>
            </div>
            <div className="bg-blue-50 border border-green-600 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                데이터베이스 및 콘텐츠 저장
              </h3>
              <p>
                <strong className="text-green-600">수탁업체:</strong> Supabase,
                Inc.
              </p>
              <p>
                <strong className="text-green-600">위탁업무:</strong> 사용자
                데이터베이스 관리, 인증 및 콘텐츠 저장(Supabase Storage)
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              6. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p className="mb-4">
              정보주체는 대방에 대해 언제든지 다음 각 호의 개인정보 보호 관련
              권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>개인정보 처리현황 통지요구</li>
              <li>개인정보 열람요구</li>
              <li>개인정보 정정·삭제요구</li>
              <li>개인정보 처리정지요구</li>
            </ul>
            <p>
              권리 행사는 서면, 이메일, 팩스 등으로 할 수 있으며 대방은 이에
              지체 없이 조치하겠습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              7. 개인정보보호책임자
            </h2>
            <p className="mb-4">
              대방은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-blue-50 border border-green-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                개인정보보호책임자
              </h3>
              <p>
                <strong className="text-green-600">성명:</strong> 팀 대방
              </p>
              <p>
                <strong className="text-green-600">연락처:</strong>{" "}
                <Link
                  href="/contact"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  문의하기
                </Link>
              </p>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              8. 개인정보의 안전성 확보 조치
            </h2>
            <p className="mb-4">
              대방은 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에
              필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>암호화된 저장 및 전송 시스템 활용</li>
              <li>해킹/바이러스 대응 보안시스템 구축</li>
              <li>접속기록 보관 및 위변조 방지</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              9. 개인정보보호정책의 변경
            </h2>
            <p>
              이 개인정보보호정책은 시행일로부터 적용되며, 법령 및 방침 변경
              시에는 시행일 7일 전부터 공지사항을 통해 고지합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
