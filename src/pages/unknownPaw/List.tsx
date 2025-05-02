import {useEffect} from 'react'
import {tns} from 'tiny-slider'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

export function List() {
  return (
    <>
      <div>
        <title>모르는 개 산책 - Classified Ads and Listing Website Template.</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.svg" />
      </div>
      export default function CategorySlider(){' '}
      {useEffect(() => {
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
            '<i className="lni lni-chevron-left"></i>',
            '<i className="lni lni-chevron-right"></i>'
          ],

          responsive: {
            0: {items: 1},
            540: {items: 2},
            768: {items: 4},
            992: {items: 5},
            1170: {items: 6}
          }
        })
      }, [])}
      ;{/* ======= scroll-top ======== */}
      <a href="#" className="scroll-top btn-hover">
        <i className="lni lni-chevron-up"></i>
      </a>
      {/* <!-- Start Hero Area --> */}
      <section className="hero-area overlay">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 col-md-12 col-12">
              <div className="hero-text text-center">
                {/* <!-- Start Hero Text --> */}
                <div className="section-heading">
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Welcome to 모르는 개 산책
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".5s">
                    Buy And Sell Everything From Used Cars To Mobile Phones And <br />
                    Computers, Or Search For Property, Jobs And More.
                  </p>
                </div>
                {/* <!-- End Search Form -->
                        <!-- Start Search Form --> */}
                <div className="search-form wow fadeInUp" data-wow-delay=".7s">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12 p-0">
                      <div className="search-input">
                        <label htmlFor="keyword">
                          <i className="lni lni-search-alt theme-color"></i>
                        </label>
                        <input
                          type="text"
                          name="keyword"
                          id="keyword"
                          placeholder="Product keyword"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-12 p-0">
                      <div className="search-input">
                        <label htmlFor="category">
                          <i className="lni lni-grid-alt theme-color"></i>
                        </label>
                        <select name="category" id="category">
                          <option value="none" selected disabled>
                            Categories
                          </option>
                          <option value="none">Vehicle</option>
                          <option value="none">Electronics</option>
                          <option value="none">Mobiles</option>
                          <option value="none">Furniture</option>
                          <option value="none">Fashion</option>
                          <option value="none">Jobs</option>
                          <option value="none">Real Estate</option>
                          <option value="none">Animals</option>
                          <option value="none">Education</option>
                          <option value="none">Matrimony</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-12 p-0">
                      <div className="search-input">
                        <label htmlFor="location">
                          <i className="lni lni-map-marker theme-color"></i>
                        </label>
                        <select name="location" id="location">
                          <option value="none" selected disabled>
                            Locations
                          </option>
                          <option value="none">New York</option>
                          <option value="none">California</option>
                          <option value="none">Washington</option>
                          <option value="none">Birmingham</option>
                          <option value="none">Chicago</option>
                          <option value="none">Phoenix</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12 p-0">
                      <div className="search-btn button">
                        <button className="btn">
                          <i className="lni lni-search-alt"></i> Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- End Search Form --> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End Hero Area --> */}
      {/* <!-- Start Categories Area --> */}
      <section className="categories">
        <div className="container">
          <div className="cat-inner">
            <div className="row">
              <div className="col-12 p-0">
                <div className="category-slider">
                  {/* <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat ">
                    <div className="icon">
                      <img src="assets/images/categories/car.svg" alt="#" />
                    </div>
                    <h3>Vehicle</h3>
                    <h5 className="total">35</h5>
                  </a>
                  {/* <!-- End Single Category --> */}
                  {/* <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/laptop.svg" alt="#" />
                    </div>
                    <h3>Electronics</h3>
                    <h5 className="total">22</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/matrimony.svg" alt="#" />
                    </div>
                    <h3>Matrimony</h3>
                    <h5 className="total">55</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/furniture.svg" alt="#" />
                    </div>
                    <h3>Furnitures</h3>
                    <h5 className="total">21</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/jobs.svg" alt="#" />
                    </div>
                    <h3>Jobs</h3>
                    <h5 className="total">44</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/real-estate.svg" alt="#" />
                    </div>
                    <h3>Real Estate</h3>
                    <h5 className="total">65</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/laptop.svg" alt="#" />
                    </div>
                    <h3>Education</h3>
                    <h5 className="total">35</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/hospital.svg" alt="#" />
                    </div>
                    <h3>Health & Beauty</h3>
                    <h5 className="total">22</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/tshirt.svg" alt="#" />
                    </div>
                    <h3>Fashion</h3>
                    <h5 className="total">25</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/education.svg" alt="#" />
                    </div>
                    <h3>Education</h3>
                    <h5 className="total">42</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/controller.svg" alt="#" />
                    </div>
                    <h3>Gadgets</h3>
                    <h5 className="total">32</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/travel.svg" alt="#" />
                    </div>
                    <h3>Backpacks</h3>
                    <h5 className="total">15</h5>
                  </a>
                  {/* <!-- End Single Category -->
                            <!-- Start Single Category --> */}
                  <a href="category.html" className="single-cat">
                    <div className="icon">
                      <img src="assets/images/categories/watch.svg" alt="#" />
                    </div>
                    <h3>Watches</h3>
                    <h5 className="total">65</h5>
                  </a>

                  {/* <!-- End Single Category --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <section className="items-grid section custom-padding">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h2 className="wow fadeInUp" data-wow-delay=".4s">
                    Latest Products
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".6s">
                    There are many variations of passages of Lorem Ipsum available, but
                    the majority have suffered alteration in some form.
                  </p>
                </div>
              </div>
            </div>
            <div className="single-head">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  {/* < />!-- Start Single Grid --> */}
                  <div className="single-grid wow fadeInUp" data-wow-delay=".2s">
                    <div className="image">
                      <a href="item-details.html" className="thumbnail">
                        <img src="assets/images/items-grid/img1.jpg" alt="#" />
                      </a>
                      <div className="author">
                        <div className="author-image">
                          <a href="javascript:void(0)">
                            <img src="assets/images/items-grid/author-1.jpg" alt="#" />
                            <span>Smith jeko</span>
                          </a>
                        </div>
                        <p className="sale">For Sale</p>
                      </div>
                    </div>
                    <div className="content">
                      <div className="top-content">
                        <a href="javascript:void(0)" className="tag">
                          Mobile Phones
                        </a>
                        <h3 className="title">
                          <a href="item-details.html">Apple Iphone X</a>
                        </h3>
                        <p className="update-time">Last Updated: 1 hours ago</p>
                        <ul className="rating">
                          <li>
                            <i className="lni lni-star-filled" />
                          </li>
                          <li>
                            <i className="lni lni-star-filled" />
                          </li>
                          <li>
                            <i className="lni lni-star-filled" />
                          </li>
                          <li>
                            <i className="lni lni-star-filled" />
                          </li>
                          <li>
                            <i className="lni lni-star-filled" />
                          </li>
                          <li>
                            <a href="javascript:void(0)">(35)</a>
                          </li>
                        </ul>
                        <ul className="info-list">
                          <li>
                            <a href="javascript:void(0)">
                              <i className="lni lni-map-marker" /> New York, US
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <i className="lni lni-timer" /> Feb 18, 2023
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="bottom-content">
                        <p className="price">
                          Start From: <span>$200.00</span>
                        </p>
                        <a href="javascript:void(0)" className="like">
                          <i className="lni lni-heart"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* < />!-- End Single Grid --> */}
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  {/* < />!-- Start Single Grid --> */}
                  <div className="single-grid wow fadeInUp" data-wow-delay=".4s">
                    <div className="image">
                      <a href="item-details.html" className="thumbnail">
                        <img src="assets/images/items-grid/img2.jpg" alt="#" />
                      </a>
                      <div className="author">
                        <div className="author-image">
                          <a href="javascript:void(0)">
                            <img src="assets/images/items-grid/author-2.jpg" alt="#" />
                            <span>Alex Jui</span>
                          </a>
                        </div>
                        <p className="sale">For Sale</p>
                      </div>
                    </div>
                    <div className="content">
                      <div className="top-content">
                        <a href="javascript:void(0)" className="tag">
                          Real Estate
                        </a>
                        <h3 className="title">
                          <a href="item-details.html">Amazing Room for Rent</a>
                        </h3>
                        <p className="update-time">Last Updated: 2 hours ago</p>
                        <ul className="rating">
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <a href="javascript:void(0)">(20)</a>
                          </li>
                        </ul>
                        <ul className="info-list">
                          <li>
                            <a href="javascript:void(0)">
                              <i className="lni lni-map-marker"></i> Dallas, Washington
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <i className="lni lni-timer"></i> Jan 7, 2023
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="bottom-content">
                        <p className="price">
                          Start From: <span>$450.00</span>
                        </p>
                        <a href="javascript:void(0)" className="like">
                          <i className="lni lni-heart"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* < />!-- End Single Grid --> */}
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  {/* < />!-- Start Single Grid --> */}
                  <div className="single-grid wow fadeInUp" data-wow-delay=".6s">
                    <div className="image">
                      <a href="item-details.html" className="thumbnail">
                        <img src="assets/images/items-grid/img3.jpg" alt="#" />
                      </a>
                      <div className="author">
                        <div className="author-image">
                          <a href="javascript:void(0)">
                            <img src="assets/images/items-grid/author-3.jpg" alt="#" />
                            <span>Devid Milan</span>
                          </a>
                        </div>
                        <p className="sale">For Sale</p>
                      </div>
                      <p className="item-position">
                        <i className="lni lni-bolt"></i> Featured
                      </p>
                    </div>
                    <div className="content">
                      <div className="top-content">
                        <a href="javascript:void(0)" className="tag">
                          Mobile Phones
                        </a>
                        <h3 className="title">
                          <a href="item-details.html">Canon SX Powershot D-SLR</a>
                        </h3>
                        <p className="update-time">Last Updated: 3 hours ago</p>
                        <ul className="rating">
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <a href="javascript:void(0)">(55)</a>
                          </li>
                        </ul>
                        <ul className="info-list">
                          <li>
                            <a href="javascript:void(0)">
                              <i className="lni lni-map-marker"></i> New York, US
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <i className="lni lni-timer"></i> Mar 18, 2023
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="bottom-content">
                        <p className="price">
                          Start From: <span>$700.00</span>
                        </p>
                        <a href="javascript:void(0)" className="like">
                          <i className="lni lni-heart"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* < />!-- End Single Grid --> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /End Items Grid Area */}
      </div>
    </>
  )
}
