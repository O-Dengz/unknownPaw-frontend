import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import Header from '../../components/Layout/Header'
import './Post.css'

export function About() {
  return (
    <>
      <Header />
      <main className="item-details">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2>About Us</h2>
                <p>모르는 개 산책 서비스에 대해 알아보세요</p>
              </div>
            </div>
          </div>
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="content-left">
                <img src="assets/images/about/choose-left.jpg" alt="#" />
                <a
                  href="https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM"
                  className="glightbox video">
                  <i className="lni lni-play"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              <div className="content-right">
                <span className="sub-heading">About</span>
                <h2>'모르는 개 산책' 서비스 소개</h2>
                <p>
                  강아지를 좋아하지만 직접 키우지 못하는 사람들은 미디어를 통해서만
                  반려견을 접하는 경우가 많습니다. 강아지의 성향과 체력에 맞는 적절한 산책
                  방식이 고려되지 않는 경우도 많죠 모개는 이러한 문제를 해결하기 위해,
                  보호자, 그리고 반려견을 사랑하는 사람을 안전하게 연결하는 플랫폼입니다.
                </p>
                <h3>차별점과 핵심 기능</h3>
                <p>
                  각 견종마다 성향과 운동량이 다릅니다. 운동량이 많은 견종은 활동적인
                  산책러와, 온순하고 차분한 견종은 편안한 산책을 원하는 사람과 매칭될 수
                  있도록 도와줍니다. 예를 들어, 시베리안 허스키나 보더콜리는 활동적인
                  산책러와, 말티즈나 퍼그는 가벼운 산책을 원하는 사람과 연결됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
