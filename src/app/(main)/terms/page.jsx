import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-900 to-green-600 text-white text-center px-8 py-10">
          <h1 className="text-3xl font-bold mb-2">이용약관</h1>
          <p className="text-sm opacity-90">최종 업데이트: 2025년 7월 11일</p>
        </div>

        <div className="px-8 py-10 leading-relaxed space-y-10 text-justify">
          <section>
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              제1조 (목적)
            </h2>
            <p className="text-md">
              이 약관은 대방(이하 "회사")이 제공하는 인터넷 관련 서비스(이하
              "서비스")의 이용조건 및 절차에 관한 기본적인 사항을 규정함을
              목적으로 합니다.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
              제2조 (용어의 정의)
            </h2>
            <p className="text-md">
              이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>
                <strong className="text-green-600">"서비스"</strong>라 함은
                구현되는 단말기(PC, 휴대폰, PDA 등의 각종 유무선 장치를 포함)와
                상관없이 "이용자"가 이용할 수 있는 대방 관련 제반 서비스를
                의미합니다.
              </li>
              <li>
                <strong className="text-green-600">"이용자"</strong>라 함은 당
                사이트에 접속하여 이 약관에 따라 당 사이트가 제공하는 서비스를
                받는 회원 및 비회원을 말합니다.
              </li>
              <li>
                <strong className="text-green-600">"회원"</strong>이라 함은
                서비스를 이용하기 위하여 당 사이트에 개인정보를 제공하여
                아이디(ID)와 비밀번호를 부여받은 자를 말합니다.
              </li>
              <li>
                <strong className="text-green-600">"비회원"</strong>이라 함은
                회원에 가입하지 않고 "회사"가 제공하는 서비스를 이용하는 자를
                말합니다.
              </li>
            </ul>
          </section>

          {[
            {
              title: "제3조 (약관의 효력 및 변경)",
              items: [
                "이 약관은 당 사이트에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.",
                '"회사"는 약관의규제에관한법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.',
                "개정 시 적용일자 및 개정사유를 명시하여 7일 전부터 공지합니다.",
              ],
            },
            {
              title: "제4조 (서비스의 제공 및 변경)",
              items: [
                "“회사”는 다음과 같은 업무를 수행합니다.",
                "“회사”는 서비스의 내용 및 제공일자를 변경할 경우에 그 사유를 “이용자”에게 통지합니다.",
              ],
              subItems: [
                "부동산 매물 정보 제공 서비스",
                "회원 관리 업무",
                '기타 "회사"가 정하는 업무',
              ],
            },
            {
              title: "제5조 (서비스의 중단)",
              items: [
                "보수점검, 교체, 고장, 통신 두절 등의 사유로 일시 중단할 수 있습니다.",
                "이 경우 제8조 방법으로 “이용자”에게 통지합니다.",
                "배상 책임은 고의 또는 중과실이 아닌 경우 면제됩니다.",
              ],
            },
            {
              title: "제6조 (회원가입)",
              items: [
                "회원가입은 동의 후 신청하고 “회사”가 승낙하여 체결됩니다.",
                "다음에 해당하는 경우 승낙하지 않거나 해지할 수 있습니다.",
              ],
              subItems: [
                "실명이 아니거나 타인의 명의를 이용한 경우",
                "허위 정보 기재 또는 회사가 요구한 사항 미기재",
                "14세 미만 아동이 법정대리인 동의 없이 신청한 경우",
                "기타 규정 위반 등",
              ],
            },
            {
              title: "제7조 (회원 탈퇴 및 자격 상실)",
              items: [
                "회원은 탈퇴 요청 시 “회사”는 즉시 탈퇴를 처리합니다.",
                "다음 사유에 해당할 경우 자격을 제한 또는 정지할 수 있습니다.",
              ],
              subItems: [
                "허위 정보 등록",
                "타인 서비스 이용 방해 또는 정보 도용",
                "법령·약관에 위반되거나 공서양속에 반하는 행위",
              ],
            },
            {
              title: "제8조 (회원에 대한 통지)",
              items: [
                "회원에게는 지정한 이메일을 통해 통지합니다.",
                "불특정 다수일 경우 1주일 이상 게시판에 게시하며, 중요 내용은 개별 통지합니다.",
              ],
            },
            {
              title: "제9조 (이용자의 의무)",
              items: ["이용자는 다음 행위를 하여서는 안 됩니다."],
              subItems: [
                "허위 내용 등록",
                "타인 정보 도용",
                "회사 게시 정보 변경",
                "회사 승인 없이 정보 송신/게시",
                "지적재산권 침해",
                "명예 훼손 또는 업무 방해",
                "외설적 또는 폭력적 컨텐츠 게시",
              ],
            },
            {
              title: "제10조 (저작권의 귀속 및 이용제한)",
              items: [
                "“회사” 작성 콘텐츠의 저작권은 “회사”에 귀속됩니다.",
                "사전 승낙 없이 복제·전송·배포 등 이용 불가합니다.",
                "이용자 콘텐츠 이용 시 사전 통보합니다.",
              ],
            },
            {
              title: "제11조 (분쟁해결)",
              items: [
                "피해보상 처리 기능을 설치·운영합니다.",
                "불만사항은 우선 처리하며, 지연 시 이유 및 일정을 통보합니다.",
                "분쟁은 공정거래위원회 또는 분쟁조정기구의 조정을 따를 수 있습니다.",
              ],
            },
            {
              title: "제12조 (재판권 및 준거법)",
              items: [
                "소송은 이용자 주소지 또는 민사소송법에 따른 관할 법원에 제기합니다.",
                "한국법을 준거법으로 적용합니다.",
              ],
            },
          ].map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-semibold text-green-900 border-b-2 border-green-600 pb-2 mb-4">
                {section.title}
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i === 0 && section.subItems && (
                      <ul className="list-disc list-inside mt-2 ml-5 space-y-1">
                        {section.subItems.map((subItem, si) => (
                          <li key={si}>{subItem}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
