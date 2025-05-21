import {useState} from 'react'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import Header from '../../components/Layout/Header'

export default function Faq() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('collapseOne')

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  return (
    <>
      <Header />
      <main>
        <div>
          <div className="breadcrumbs">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="breadcrumbs-content">
                    <h1 className="page-title">자주 묻는 질문</h1>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <ul className="breadcrumb-nav">
                    <li>
                      <a href="/">홈</a>
                    </li>
                    <li>자주 묻는 질문</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <section className="dashboard section">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-12">
                  <DashboardSidebar />
                </div>
                <div className="col-lg-9 col-md-8 col-12">
                  <div className="main-content">
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                          <button
                            className={`accordion-button ${
                              activeAccordion === 'collapseOne' ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleAccordion('collapseOne')}>
                            <span>서비스 예약은 어떻게 하나요?</span>
                            <i className="lni lni-plus"></i>
                          </button>
                        </h2>
                        <div
                          id="collapseOne"
                          className={`accordion-collapse collapse ${
                            activeAccordion === 'collapseOne' ? 'show' : ''
                          }`}
                          aria-labelledby="headingOne">
                          <div className="accordion-body">
                            <p>
                              1. 메인 페이지에서 원하시는 서비스(펫호텔, 애견미용, 훈련
                              등)를 선택합니다.
                              <br />
                              2. 원하시는 날짜와 시간을 선택합니다.
                              <br />
                              3. 반려동물의 정보(나이, 품종, 특이사항 등)를 상세히
                              입력합니다.
                              <br />
                              4. 결제를 진행합니다.
                            </p>
                            <p>
                              예약이 완료되면 문자메시지와 이메일로 예약 확인 메시지가
                              발송되며, 서비스 제공자가 24시간 이내에 예약을 확정해
                              드립니다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button
                            className={`accordion-button ${
                              activeAccordion === 'collapseTwo' ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleAccordion('collapseTwo')}>
                            <span>예약 취소 및 환불 규정은 어떻게 되나요?</span>
                            <i className="lni lni-plus"></i>
                          </button>
                        </h2>
                        <div
                          id="collapseTwo"
                          className={`accordion-collapse collapse ${
                            activeAccordion === 'collapseTwo' ? 'show' : ''
                          }`}
                          aria-labelledby="headingTwo">
                          <div className="accordion-body">
                            <p>
                              [일반 취소 규정]
                              <br />
                              - 서비스 이용 7일 전 취소: 100% 환불
                              <br />
                              - 서비스 이용 5일 전 취소: 80% 환불
                              <br />
                              - 서비스 이용 3일 전 취소: 50% 환불
                              <br />- 서비스 이용 당일 취소: 환불 불가
                            </p>
                            <p>
                              [특별 취소 규정]
                              <br />
                              - 반려동물의 건강상 문제(수의사 소견서 필요): 100% 환불
                              <br />
                              - 천재지변으로 인한 취소: 100% 환불
                              <br />- 서비스 제공자의 사유로 인한 취소: 100% 환불 및 추가
                              보상
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                          <button
                            className={`accordion-button ${
                              activeAccordion === 'collapseThree' ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleAccordion('collapseThree')}>
                            <span>서비스 이용 전 필요한 준비물이 있나요?</span>
                            <i className="lni lni-plus"></i>
                          </button>
                        </h2>
                        <div
                          id="collapseThree"
                          className={`accordion-collapse collapse ${
                            activeAccordion === 'collapseThree' ? 'show' : ''
                          }`}
                          aria-labelledby="headingThree">
                          <div className="accordion-body">
                            <p>
                              [공통 준비물]
                              <br />
                              - 반려동물 등록증
                              <br />
                              - 예방접종 기록부(최근 1년 이내)
                              <br />- 반려동물 건강수첩
                            </p>
                            <p>
                              [서비스별 준비물]
                              <br />
                              펫호텔 이용 시:
                              <br />
                              - 평소 먹는 사료 (2일치 추가 분량)
                              <br />
                              - 평소 사용하는 장난감 1-2개
                              <br />
                              - 배변패드, 배변봉투
                              <br />
                              <br />
                              애견미용 이용 시:
                              <br />
                              - 평소 사용하는 샴푸(필요시)
                              <br />
                              <br />
                              훈련 이용 시:
                              <br />
                              - 평소 사용하는 장난감
                              <br />- 간식
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                          <button
                            className={`accordion-button ${
                              activeAccordion === 'collapseFour' ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleAccordion('collapseFour')}>
                            <span>긴급상황 발생 시 어떻게 대처하나요?</span>
                            <i className="lni lni-plus"></i>
                          </button>
                        </h2>
                        <div
                          id="collapseFour"
                          className={`accordion-collapse collapse ${
                            activeAccordion === 'collapseFour' ? 'show' : ''
                          }`}
                          aria-labelledby="headingFour">
                          <div className="accordion-body">
                            <p>
                              [긴급상황 대처 프로세스]
                              <br />
                              1. 응급상황 발생 시 보호자님께 즉시 연락
                              <br />
                              2. 상황에 따라 제휴 동물병원으로 신속 이동
                              <br />
                              3. 24시간 전문 수의사 상담 가능
                            </p>
                            <p>
                              [보상 규정]
                              <br />
                              - 서비스 제공자의 과실로 인한 사고: 치료비 전액 보상
                              <br />
                              - 천재지변으로 인한 사고: 보험 적용
                              <br />- 기존 질환으로 인한 응급상황: 치료비 실비 지원
                            </p>
                            <p>
                              * 모든 서비스 제공자는 반려동물 응급처치 자격증을 보유하고
                              있습니다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive">
                          <button
                            className={`accordion-button ${
                              activeAccordion === 'collapseFive' ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleAccordion('collapseFive')}>
                            <span>서비스 제공자는 어떤 기준으로 선정되나요?</span>
                            <i className="lni lni-plus"></i>
                          </button>
                        </h2>
                        <div
                          id="collapseFive"
                          className={`accordion-collapse collapse ${
                            activeAccordion === 'collapseFive' ? 'show' : ''
                          }`}
                          aria-labelledby="headingFive">
                          <div className="accordion-body">
                            <p>
                              [필수 자격 요건]
                              <br />
                              - 관련 자격증 보유 (반려동물관리사, 애견미용사 등)
                              <br />
                              - 실무 경력 3년 이상
                              <br />- 범죄경력 조회 통과
                            </p>
                            <p>
                              [검증 절차]
                              <br />
                              1. 서류 심사
                              <br />
                              2. 실무 테스트
                              <br />
                              3. 대면 인터뷰
                              <br />
                              4. 고객 서비스 교육 이수
                              <br />
                              5. 위생 및 안전 교육 수료
                            </p>
                            <p>
                              * 모든 서비스 제공자는 분기별 재교육을 통해 서비스 품질을
                              유지합니다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingSix">
                          <button
                            className={`accordion-button ${
                              activeAccordion === 'collapseSix' ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleAccordion('collapseSix')}>
                            <span>
                              반려동물 등록이 안 되어있어도 서비스를 이용할 수 있나요?
                            </span>
                            <i className="lni lni-plus"></i>
                          </button>
                        </h2>
                        <div
                          id="collapseSix"
                          className={`accordion-collapse collapse ${
                            activeAccordion === 'collapseSix' ? 'show' : ''
                          }`}
                          aria-labelledby="headingSix">
                          <div className="accordion-body">
                            <p>
                              반려동물 등록은 법적 의무사항이며, 안전한 서비스 제공을 위해
                              반드시 등록된 반려동물만 서비스 이용이 가능합니다.
                            </p>
                            <p>
                              [등록 방법 안내]
                              <br />
                              1. 가까운 동물병원 방문
                              <br />
                              2. 내장형 칩 삽입 또는 외장형 등록
                              <br />
                              3. 주민센터 또는 정부24를 통한 등록 신청
                            </p>
                            <p>
                              * 반려동물 등록 관련 상담이 필요하시다면 고객센터로 문의해
                              주세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="contact-section">
                      <div className="row">
                        <div className="col-lg-5 col-12">
                          <div className="contact-info">
                            <div className="contact-info-content">
                              <h2>고객센터 안내</h2>
                              <p>
                                서비스 이용에 궁금하신 점이 있으시다면 언제든 문의해
                                주세요. 친절하고 상세한 답변으로 도와드리겠습니다.
                              </p>
                            </div>
                            <div className="single-info">
                              <h3>운영시간</h3>
                              <ul>
                                <li>평일: 09:00 - 18:00</li>
                                <li>토요일: 09:00 - 13:00</li>
                                <li>일요일/공휴일: 휴무</li>
                                <li>* 긴급상황 발생 시 24시간 핫라인 운영</li>
                              </ul>
                            </div>
                            <div className="single-info">
                              <h3>연락처</h3>
                              <ul>
                                <li>서울특별시 강남구 테헤란로 123</li>
                                <li>펫케어타워 8층</li>
                                <li>
                                  <a href="mailto:help@petcare.com">help@petcare.com</a>
                                </li>
                                <li>
                                  <a href="tel:1544-0000">1544-0000</a>
                                </li>
                                <li>긴급상황 핫라인: 1544-1111</li>
                              </ul>
                            </div>
                            <div className="single-info contact-social">
                              <h3>SNS 채널</h3>
                              <ul>
                                <li>
                                  <a href="#">
                                    <i className="lni lni-facebook-original"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i className="lni lni-twitter-original"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i className="lni lni-instagram"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i className="lni lni-kakao-talk"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-7 col-12">
                          <div className="contact-form-wrapper">
                            <div className="form-title">
                              <h2>문의하기</h2>
                              <p>
                                서비스 이용 중 불편사항이나 문의사항이 있으시다면 아래
                                양식을 작성해 주세요.
                              </p>
                            </div>
                            <form className="form" onSubmit={e => e.preventDefault()}>
                              <div className="row">
                                <div className="col-lg-6 col-12">
                                  <div className="form-group">
                                    <input
                                      name="name"
                                      type="text"
                                      placeholder="이름"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="form-group">
                                    <input
                                      name="subject"
                                      type="text"
                                      placeholder="제목"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="form-group">
                                    <input
                                      name="email"
                                      type="email"
                                      placeholder="이메일"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="form-group">
                                    <input
                                      name="phone"
                                      type="text"
                                      placeholder="연락처"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group message">
                                    <textarea
                                      name="message"
                                      placeholder="문의내용을 입력해 주세요."></textarea>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group button">
                                    <button type="submit" className="btn">
                                      문의하기
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="map-section">
                      <div className="map-container">
                        <div className="mapouter">
                          <div className="gmap_canvas">
                            <iframe
                              // 원하는 위치로 바꾸고 싶을 땐 : 웹사이트 임베드 - google maps platform에서 api 발급
                              width="100%"
                              height="500"
                              id="gmap_canvas"
                              src="https://maps.google.com/maps?q=서울특별시+강남구+테헤란로+123&t=&z=15&ie=UTF8&iwloc=&output=embed"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
