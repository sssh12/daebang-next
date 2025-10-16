const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-gray-100 p-6 border-3 border-accent rounded-lg shadow-md">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-extrabold text-main mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-8 bg-[#F8FFF8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 transition">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
            이런 경험 있으신가요?
          </h2>
          <p className="mt-4 text-text sm:text-lg">
            대학생을 위한 방 구하기, 이렇게 어려우셨나요?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FeatureCard icon="😣" title="가깝다고 했는데...">
            실제로 가보니 너무 멀었던 경험, 있으시죠?
          </FeatureCard>
          <FeatureCard icon="😱" title="CCTV도 없고 너무 어두워">
            사진과 달리 너무 낡고 어두운 방에 실망한 적, 있으시죠?
          </FeatureCard>
          <FeatureCard icon="🤢" title="이게 무슨 냄새야!">
            직접 가보니 너무 지저분하고 냄새나는 방에 당황한 적, 있으시죠?
          </FeatureCard>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mt-62 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
            대방이 해결해 드립니다!
          </h2>
          <p className="mt-4 text-text sm:text-lg">
            대학생을 위한 최적의 방 구하기 솔루션
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FeatureCard icon="🚀" title="학교 중심으로 한 눈에">
            대학생 전용 매물과 학교 주변 정보 제공으로, 원하는 방을 빠르게 찾을
            수 있습니다.
          </FeatureCard>
          <FeatureCard icon="👌" title="복잡한 조건도 간편하게">
            다양한 조건을 쉽게 설정하고, 원하는 방을 빠르게 찾을 수 있습니다.
          </FeatureCard>
          <FeatureCard icon="🤖" title="AI 기반 추천 시스템(개발 예정)">
            사용자의 선호도를 학습하여, 최적의 방을 추천합니다.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
