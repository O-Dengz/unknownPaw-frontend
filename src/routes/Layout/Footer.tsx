export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer mobile-app">
                <h3>Mobile Apps</h3>
                <div className="app-button">
                  <a onClick={e => e.preventDefault()} className="btn">
                    <i className="lni lni-play-store"></i>
                    <span className="text">
                      <span className="small-text">Get It On</span>
                      Google Play
                    </span>
                  </a>
                  <a onClick={e => e.preventDefault()} className="btn">
                    <i className="lni lni-apple"></i>
                    <span className="text">
                      <span className="small-text">Get It On</span>
                      App Store
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer f-link">
                <h3>Locations</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12">
                    <ul>
                      <li>
                        <a onClick={e => e.preventDefault()}>Chicago</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>New York City</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>San Francisco</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>Washington</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>Boston</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <ul>
                      <li>
                        <a onClick={e => e.preventDefault()}>Los Angeles</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>Seattle</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>Las Vegas</a>
                      </li>
                      <li>
                        <a onClick={e => e.preventDefault()}>San Diego</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer f-link">
                <h3>Quick Links</h3>
                <ul>
                  <li>
                    <a onClick={e => e.preventDefault()}>About Us</a>
                  </li>
                  <li>
                    <a onClick={e => e.preventDefault()}>How It's Works</a>
                  </li>
                  <li>
                    <a onClick={e => e.preventDefault()}>Login</a>
                  </li>
                  <li>
                    <a onClick={e => e.preventDefault()}>Signup</a>
                  </li>
                  <li>
                    <a onClick={e => e.preventDefault()}>Help & Support</a>
                  </li>
                  <li>
                    <a href="/dashboard">My Page</a>
                  </li>
                  <li>
                    <a href="/member/profile">회원 프로필</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer f-contact">
                <h3>Contact</h3>
                <ul>
                  <li>
                    23 New Design Str, Lorem Upsum 10
                    <br />
                    Hudson Yards, USA
                  </li>
                  <li>
                    Tel. +(123) 1800-567-8990 <br />
                    Mail. support@classigrids.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="inner">
            <div className="row">
              <div className="col-12">
                <div className="content">
                  <ul className="footer-bottom-links">
                    <li>
                      <a onClick={e => e.preventDefault()}>Terms of use</a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}> Privacy Policy</a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}>Advanced Search</a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}>Site Map</a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}>Information</a>
                    </li>
                  </ul>
                  <p className="copyright-text">
                    Designed and Developed by
                    <a href="https://graygrids.com/" rel="nofollow" target="_blank">
                      GrayGrids
                    </a>
                  </p>
                  <ul className="footer-social">
                    <li>
                      <a onClick={e => e.preventDefault()}>
                        <i className="lni lni-facebook-filled"></i>
                      </a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}>
                        <i className="lni lni-twitter-original"></i>
                      </a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}>
                        <i className="lni lni-youtube"></i>
                      </a>
                    </li>
                    <li>
                      <a onClick={e => e.preventDefault()}>
                        <i className="lni lni-linkedin-original"></i>
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
