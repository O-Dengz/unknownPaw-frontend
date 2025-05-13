// src/pages/unknownPaw/List.tsx
import React, {useEffect} from 'react'
import {tns} from 'tiny-slider'
import {Link} from 'react-router-dom'

// ── 전역 스타일 ──────────────────────────────────────────
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

// (선택) <head> 관리가 필요하면 react‑helmet‑async 사용
// import { Helmet } from 'react-helmet-async';

export function List() {
  /* ──────────────────────────────────────────────────────
     tiny‑slider 초기화
  ─────────────────────────────────────────────────────── */
  useEffect(() => {
    tns({
      container: '.category-slider',
      items: 3,
      slideBy: 'page',
      autoplay: false,
      mouseDrag: true,
      gutter: 0,
      nav: false,
      controls: true,
      controlsText: [
        '<i class="lni lni-chevron-left"></i>',
        '<i class="lni lni-chevron-right"></i>'
      ],
      responsive: {
        0: {items: 1},
        540: {items: 2},
        768: {items: 4},
        992: {items: 5},
        1170: {items: 6}
      }
    })
  }, [])

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <>
      {/* 필요하다면 Helmet으로 head 수정 */}
      {/* 
      <Helmet>
        <title>모르는 개 산책 – Classified Ads</title>
        <meta name="description" content="Buy & sell anything…" />
      </Helmet>
      */}

      {/* ── Scroll‑top 버튼 ──────────────────────────────── */}
      <span onClick={handleScrollTop} className="scroll-top btn-hover">
        <i className="lni lni-chevron-up" />
      </span>

      {/* ── Hero Area ───────────────────────────────────── */}
      <section className="hero-area overlay">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 col-md-12 col-12">
              <div className="hero-text text-center">
                <div className="section-heading">
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Welcome to 모르는 개 산책
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".5s">
                    Buy and sell everything from used cars to mobile phones and computers,
                    or search for property, jobs and more.
                  </p>
                </div>

                {/* ── Search Form ─────────────────────── */}
                <div className="search-form wow fadeInUp" data-wow-delay=".7s">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12 p-0">
                      <div className="search-input">
                        <label htmlFor="keyword">
                          <i className="lni lni-search-alt theme-color" />
                        </label>
                        <input type="text" id="keyword" placeholder="Product keyword" />
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-3 col-12 p-0">
                      <div className="search-input">
                        <label htmlFor="category">
                          <i className="lni lni-grid-alt theme-color" />
                        </label>
                        <select id="category" defaultValue="">
                          <option value="" disabled>
                            Categories
                          </option>
                          <option>Vehicle</option>
                          <option>Electronics</option>
                          <option>Mobiles</option>
                          <option>Furniture</option>
                          <option>Fashion</option>
                          <option>Jobs</option>
                          <option>Real Estate</option>
                          <option>Animals</option>
                          <option>Education</option>
                          <option>Matrimony</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-3 col-12 p-0">
                      <div className="search-input">
                        <label htmlFor="location">
                          <i className="lni lni-map-marker theme-color" />
                        </label>
                        <select id="location" defaultValue="">
                          <option value="" disabled>
                            Locations
                          </option>
                          <option>New York</option>
                          <option>California</option>
                          <option>Washington</option>
                          <option>Birmingham</option>
                          <option>Chicago</option>
                          <option>Phoenix</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12 p-0">
                      <button className="btn w-100 h-100">
                        <i className="lni lni-search-alt" /> Search
                      </button>
                    </div>
                  </div>
                </div>
                {/* ── /Search Form ────────────────────── */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── /Hero Area ──────────────────────────────────── */}

      {/* ── Categories Slider ───────────────────────────── */}
      <section className="categories">
        <div className="container">
          <div className="cat-inner">
            <div className="row">
              <div className="col-12 p-0">
                <div className="category-slider">
                  {/* 예시 카테고리 카드 – 필요만큼 복제 */}
                  <a href="#" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/car.svg" alt="Vehicle" />
                    </div>
                    <h3>Vehicle</h3>
                    <h5 className="total">35</h5>
                  </a>

                  {/* …다른 카테고리 생략… */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── /Categories ────────────────────────────────── */}

      {/* ── Latest Products Grid ───────────────────────── */}
      <section className="items-grid section custom-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Latest Products
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  There are many variations of passages of Lorem Ipsum available, but the
                  majority have suffered alteration.
                </p>
              </div>
            </div>
          </div>

          {/* ── 상품 카드 3개 예시 (필요시 map) ── */}
          <div className="row">
            {/* Card 1 */}
            <div className="col-lg-4 col-md-6 col-12">
              <div className="single-grid wow fadeInUp" data-wow-delay=".2s">
                <div className="image">
                  <a href="#" className="thumbnail">
                    <img src="assets/images/items-grid/img1.jpg" alt="item" />
                  </a>
                  <div className="author">
                    <div className="author-image">
                      <a href="#">
                        <img src="assets/images/items-grid/author-1.jpg" alt="" />
                        <span>Smith jeko</span>
                      </a>
                    </div>
                    <p className="sale">For Sale</p>
                  </div>
                </div>

                <div className="content">
                  <div className="top-content">
                    <a href="#" className="tag">
                      Mobile Phones
                    </a>
                    <h3 className="title">
                      <a href="#">Apple iPhone X</a>
                    </h3>
                    <p className="update-time">Last Updated: 1 hour ago</p>

                    <ul className="rating">
                      {[...Array(5)].map((_, i) => (
                        <li key={i}>
                          <i className="lni lni-star-filled" />
                        </li>
                      ))}
                      <li>
                        <a href="#">(35)</a>
                      </li>
                    </ul>

                    <ul className="info-list">
                      <li>
                        <i className="lni lni-map-marker" /> New York, US
                      </li>
                      <li>
                        <i className="lni lni-timer" /> Feb 18, 2023
                      </li>
                    </ul>
                  </div>

                  <div className="bottom-content">
                    <p className="price">
                      Start From: <span>$200.00</span>
                    </p>
                    <a href="#" className="like">
                      <i className="lni lni-heart" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 & 3 … 생략 (원본과 동일하게 복제) */}
          </div>
        </div>
      </section>
      {/* ── /Latest Products Grid ──────────────────────── */}
    </>
  )
}
