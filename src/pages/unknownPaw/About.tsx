import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

export function About() {
  return (
    <>
      {/* <!--[if lte IE 9]> */}
      <p className="browserupgrade">
        You are using an <strong>outdated</strong> browser. Please
        <a href="https://browsehappy.com/">upgrade your browser</a> to improve your
        experience and security.
      </p>
      {/* <![endif]--> */}

      {/* <!-- Start Breadcrumbs --> */}
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">About Us</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>About Us</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- End Breadcrumbs -->

    <!-- Start About Area --> */}
      <section className="about-us section">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="content-left wow fadeInLeft" data-wow-delay=".3s">
                <img src="assets/images/about/choose-left.jpg" alt="#" />
                <a
                  href="https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM"
                  className="glightbox video">
                  <i className="lni lni-play"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              {/* <!-- content-1 start --> */}
              <div className="content-right wow fadeInRight" data-wow-delay=".5s">
                {/* <!-- Heading --> */}
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
                {/* <!-- End Heading --> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End About Area -->

    <!-- Start How Works Area --> */}
      <section className="how-works section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  How it Works
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  There are many variations of passages of Lorem Ipsum available, but the
                  majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-12">
              {/* <!-- Start Single Work --> */}
              <div className="single-work wow fadeInUp" data-wow-delay=".2s">
                <span className="serial">01</span>
                <h3>Create Account</h3>
                <p>
                  Lorem ipsum dolor sit amet constur adipisicing sed do eiusmod tempor
                  incididunt labore.
                </p>
              </div>
              {/* <!-- End Single Work --> */}
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              {/* <!-- Start Single Work --> */}
              <div className="single-work wow fadeInUp" data-wow-delay=".4s">
                <span className="serial">02</span>
                <h3>Post Your Ads</h3>
                <p>
                  Lorem ipsum dolor sit amet constur adipisicing sed do eiusmod tempor
                  incididunt labore.
                </p>
              </div>
              {/* <!-- End Single Work --> */}
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              {/* <!-- Start Single Work --> */}
              <div className="single-work wow fadeInUp" data-wow-delay=".6s">
                <span className="serial">03</span>
                <h3>Sell Your Item</h3>
                <p>
                  Lorem ipsum dolor sit amet constur adipisicing sed do eiusmod tempor
                  incididunt labore.
                </p>
              </div>
              {/* <!-- End Single Work --> */}
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End How Works Area -->

    <!-- Start Achievement Area --> */}
      <section className="our-achievement section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-12">
              <div className="single-achievement wow fadeInUp" data-wow-delay=".2s">
                <h3 className="counter">
                  <span id="secondo1" className="countup" cup-end="1250">
                    1250
                  </span>
                  +
                </h3>
                <p>Regular Ads</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-12">
              <div className="single-achievement wow fadeInUp" data-wow-delay=".4s">
                <h3 className="counter">
                  <span id="secondo2" className="countup" cup-end="350">
                    350
                  </span>
                  +
                </h3>
                <p>Locations</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-12">
              <div className="single-achievement wow fadeInUp" data-wow-delay=".6s">
                <h3 className="counter">
                  <span id="secondo3" className="countup" cup-end="2500">
                    2500
                  </span>
                  +
                </h3>
                <p>Reguler Members</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-12">
              <div className="single-achievement wow fadeInUp" data-wow-delay=".6s">
                <h3 className="counter">
                  <span id="secondo3" className="countup" cup-end="250">
                    250
                  </span>
                  +
                </h3>
                <p>Premium Ads</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End Achievement Area --> */}
    </>
  )
}
