import React from 'react'
import {Link} from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-12">
          <div className="single-footer f-about">
            <div className="logo">
              <a href="index.html">
                <img src="assets/images/logo/logo.svg" alt="#" />
              </a>
            </div>
            <p>모르는 개 산책은 반려견 산책 서비스를 제공하는 플랫폼입니다.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <div className="single-footer f-link">
            <h3>서비스</h3>
            <ul>
              <li>
                <a href="javascript:void(0)">산책 서비스</a>
              </li>
              <li>
                <a href="javascript:void(0)">펫시터 서비스</a>
              </li>
              <li>
                <a href="javascript:void(0)">커뮤니티</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <div className="single-footer f-link">
            <h3>고객센터</h3>
            <ul>
              <li>
                <a href="javascript:void(0)">자주 묻는 질문</a>
              </li>
              <li>
                <a href="javascript:void(0)">1:1 문의</a>
              </li>
              <li>
                <a href="javascript:void(0)">이용약관</a>
              </li>
              <li>
                <a href="javascript:void(0)">개인정보처리방침</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <div className="single-footer f-contact">
            <h3>연락처</h3>
            <ul>
              <li>운영시간: 평일 09:00 ~ 18:00</li>
              <li>이메일: support@unknownpaw.com</li>
              <li>전화: 02-123-4567</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="copyright">
      <div className="container">
        <div className="inner">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="left">
                <p>Copyright © 2024 모르는 개 산책. All rights reserved.</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="right">
                <ul>
                  <li>
                    <a href="javascript:void(0)">
                      <i className="lni lni-facebook-filled"></i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <i className="lni lni-twitter-original"></i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <i className="lni lni-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer
