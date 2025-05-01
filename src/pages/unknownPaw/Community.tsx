import React, {useState} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

export function Community() {
  const [rangeValue, setRangeValue] = useState(10)

  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">커뮤니티 중고거래</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>Community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <section className="category-page section">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-12">
                <div className="category-sidebar">
                  <div className="single-widget search">
                    <h3>Search Ads</h3>
                    <form action="#">
                      <input type="text" placeholder="Search Here..." />
                      <button type="submit">
                        <i className="lni lni-search-alt"></i>
                      </button>
                    </form>
                  </div>

                  <div className="single-widget">
                    <h3>All Categories</h3>
                    <ul className="list">
                      <li>
                        <a href="javascript:void(0)">
                          <i className="lni lni-dinner"></i> Hotel & Travels
                          <span>15</span>
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">
                          <i className="lni lni-control-panel"></i> Services{' '}
                          <span>20</span>
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">
                          <i className="lni lni-bullhorn"></i> Marketing <span>55</span>
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">
                          <i className="lni lni-home"></i> Real Estate<span>35</span>
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">
                          <i className="lni lni-bolt"></i> Electronics <span>60</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="single-widget range">
                    <h3>Price Range</h3>
                    <input
                      type="range"
                      className="form-range"
                      name="range"
                      step="1"
                      min="100"
                      max="10000"
                      value={rangeValue}
                      onChange={e => setRangeValue(Number(e.target.value))}
                    />
                    <div className="range-inner">
                      <label>$</label>
                      <input
                        type="text"
                        id="rangePrimary"
                        placeholder="100"
                        value={rangeValue}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="single-widget condition">
                    <h3>Condition</h3>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault1"
                      />
                      <label className="form-check-label" htmlFor="flexCheckDefault1">
                        All
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault2"
                      />
                      <label className="form-check-label" htmlFor="flexCheckDefault2">
                        New
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault3"
                      />
                      <label className="form-check-label" htmlFor="flexCheckDefault3">
                        Used
                      </label>
                    </div>
                  </div>

                  <div className="single-widget banner">
                    <h3>Advertisement</h3>
                    <a href="javascript:void(0)">
                      <img src="assets/images/items-grid/img1.jpg" alt="#" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-8 col-12">
                <div className="category-grid-list">
                  <div className="row">
                    <div className="col-12">
                      <div className="category-grid-topbar">
                        <div className="row align-items-center">
                          <div className="col-lg-6 col-md-6 col-12">
                            <h3 className="title">Showing 1-12 of 21 ads found</h3>
                          </div>
                          <div className="col-lg-6 col-md-6 col-12">
                            <nav>
                              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <button
                                  className="nav-link active"
                                  id="nav-grid-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-grid"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-grid"
                                  aria-selected="true">
                                  <i className="lni lni-grid-alt"></i>
                                </button>
                                <button
                                  className="nav-link"
                                  id="nav-list-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-list"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-list"
                                  aria-selected="false">
                                  <i className="lni lni-list"></i>
                                </button>
                              </div>
                            </nav>
                          </div>
                        </div>
                      </div>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="nav-grid"
                          role="tabpanel"
                          aria-labelledby="nav-grid-tab">
                          <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Mobile
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Apple Iphone X</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Boston
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$890.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Others
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Travel Kit</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>San Francisco
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$580.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Electronic
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Nikon DSLR Camera</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Alaska, USA
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$560.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Furniture
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Poster Paint</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Las Vegas
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$85.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Furniture
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Official Metting Chair</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Alaska, USA
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$750.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge rent">Rent</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Books & Magazine
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Story Book</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>New York, USA
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$120.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Electronic
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Cctv camera</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Delhi, India
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$350.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Mobile
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Apple Iphone X</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Boston
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$890.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                              <div className="single-item-grid">
                                <div className="image">
                                  <a href="item-details.html">
                                    <img
                                      src="assets/images/items-grid/img1.jpg"
                                      alt="#"
                                    />
                                  </a>
                                  <i className=" cross-badge lni lni-bolt"></i>
                                  <span className="flat-badge sale">Sale</span>
                                </div>
                                <div className="content">
                                  <a href="javascript:void(0)" className="tag">
                                    Mobile
                                  </a>
                                  <h3 className="title">
                                    <a href="item-details.html">Samsung Glalaxy S8</a>
                                  </h3>
                                  <p className="location">
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-map-marker"></i>Delaware, USA
                                    </a>
                                  </p>
                                  <ul className="info">
                                    <li className="price">$299.00</li>
                                    <li className="like">
                                      <a href="javascript:void(0)">
                                        <i className="lni lni-heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className="pagination left">
                                <ul className="pagination-list">
                                  <li>
                                    <a href="javascript:void(0)">1</a>
                                  </li>
                                  <li className="active">
                                    <a href="javascript:void(0)">2</a>
                                  </li>
                                  <li>
                                    <a href="javascript:void(0)">3</a>
                                  </li>
                                  <li>
                                    <a href="javascript:void(0)">4</a>
                                  </li>
                                  <li>
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-chevron-right"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-list"
                          role="tabpanel"
                          aria-labelledby="nav-list-tab">
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-12">
                              <div className="single-item-grid">
                                <div className="row align-items-center">
                                  <div className="col-lg-5 col-md-7 col-12">
                                    <div className="image">
                                      <a href="item-details.html">
                                        <img
                                          src="assets/images/items-grid/img1.jpg"
                                          alt="#"
                                        />
                                      </a>
                                      <i className=" cross-badge lni lni-bolt"></i>
                                      <span className="flat-badge sale">Sale</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-md-5 col-12">
                                    <div className="content">
                                      <a href="javascript:void(0)" className="tag">
                                        Others
                                      </a>
                                      <h3 className="title">
                                        <a href="item-details.html">Travel Kit</a>
                                      </h3>
                                      <p className="location">
                                        <a href="javascript:void(0)">
                                          <i className="lni lni-map-marker"></i>San
                                          Francisco
                                        </a>
                                      </p>
                                      <ul className="info">
                                        <li className="price">$580.00</li>
                                        <li className="like">
                                          <a href="javascript:void(0)">
                                            <i className="lni lni-heart"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                              <div className="single-item-grid">
                                <div className="row align-items-center">
                                  <div className="col-lg-5 col-md-7 col-12">
                                    <div className="image">
                                      <a href="item-details.html">
                                        <img
                                          src="assets/images/items-grid/img1.jpg"
                                          alt="#"
                                        />
                                      </a>
                                      <i className=" cross-badge lni lni-bolt"></i>
                                      <span className="flat-badge sale">Sale</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-md-5 col-12">
                                    <div className="content">
                                      <a href="javascript:void(0)" className="tag">
                                        Electronic
                                      </a>
                                      <h3 className="title">
                                        <a href="item-details.html">Nikon DSLR Camera</a>
                                      </h3>
                                      <p className="location">
                                        <a href="javascript:void(0)">
                                          <i className="lni lni-map-marker"></i>Alaska,
                                          USA
                                        </a>
                                      </p>
                                      <ul className="info">
                                        <li className="price">$560.00</li>
                                        <li className="like">
                                          <a href="javascript:void(0)">
                                            <i className="lni lni-heart"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                              <div className="single-item-grid">
                                <div className="row align-items-center">
                                  <div className="col-lg-5 col-md-7 col-12">
                                    <div className="image">
                                      <a href="item-details.html">
                                        <img
                                          src="assets/images/items-grid/img1.jpg"
                                          alt="#"
                                        />
                                      </a>
                                      <i className=" cross-badge lni lni-bolt"></i>
                                      <span className="flat-badge sale">Sale</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-md-5 col-12">
                                    <div className="content">
                                      <a href="javascript:void(0)" className="tag">
                                        Mobile
                                      </a>
                                      <h3 className="title">
                                        <a href="item-details.html">Apple Iphone X</a>
                                      </h3>
                                      <p className="location">
                                        <a href="javascript:void(0)">
                                          <i className="lni lni-map-marker"></i>Boston
                                        </a>
                                      </p>
                                      <ul className="info">
                                        <li className="price">$890.00</li>
                                        <li className="like">
                                          <a href="javascript:void(0)">
                                            <i className="lni lni-heart"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                              <div className="single-item-grid">
                                <div className="row align-items-center">
                                  <div className="col-lg-5 col-md-7 col-12">
                                    <div className="image">
                                      <a href="item-details.html">
                                        <img
                                          src="assets/images/items-grid/img1.jpg"
                                          alt="#"
                                        />
                                      </a>
                                      <i className=" cross-badge lni lni-bolt"></i>
                                      <span className="flat-badge sale">Sale</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-md-5 col-12">
                                    <div className="content">
                                      <a href="javascript:void(0)" className="tag">
                                        Furniture
                                      </a>
                                      <h3 className="title">
                                        <a href="item-details.html">Poster Paint</a>
                                      </h3>
                                      <p className="location">
                                        <a href="javascript:void(0)">
                                          <i className="lni lni-map-marker"></i>Las Vegas
                                        </a>
                                      </p>
                                      <ul className="info">
                                        <li className="price">$85.00</li>
                                        <li className="like">
                                          <a href="javascript:void(0)">
                                            <i className="lni lni-heart"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                              <div className="single-item-grid">
                                <div className="row align-items-center">
                                  <div className="col-lg-5 col-md-7 col-12">
                                    <div className="image">
                                      <a href="item-details.html">
                                        <img
                                          src="assets/images/items-grid/img1.jpg"
                                          alt="#"
                                        />
                                      </a>
                                      <i className=" cross-badge lni lni-bolt"></i>
                                      <span className="flat-badge rent">Rent</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-md-5 col-12">
                                    <div className="content">
                                      <a href="javascript:void(0)" className="tag">
                                        Books & Magazine
                                      </a>
                                      <h3 className="title">
                                        <a href="item-details.html">Story Book</a>
                                      </h3>
                                      <p className="location">
                                        <a href="javascript:void(0)">
                                          <i className="lni lni-map-marker"></i>New York,
                                          USA
                                        </a>
                                      </p>
                                      <ul className="info">
                                        <li className="price">$120.00</li>
                                        <li className="like">
                                          <a href="javascript:void(0)">
                                            <i className="lni lni-heart"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className="pagination left">
                                <ul className="pagination-list">
                                  <li>
                                    <a href="javascript:void(0)">1</a>
                                  </li>
                                  <li className="active">
                                    <a href="javascript:void(0)">2</a>
                                  </li>
                                  <li>
                                    <a href="javascript:void(0)">3</a>
                                  </li>
                                  <li>
                                    <a href="javascript:void(0)">4</a>
                                  </li>
                                  <li>
                                    <a href="javascript:void(0)">
                                      <i className="lni lni-chevron-right"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
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
    </>
  )
}
