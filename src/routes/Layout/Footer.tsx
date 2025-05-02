export default function Footer() {
  return (
    <footer className="footer" style={{ 
      fontSize: '0.8rem', 
      padding: '0.5rem 0',
      transform: 'scale(0.7)',
      transformOrigin: 'top center',
      width: '142.857%',
      marginLeft: '-21.4285%',
      marginRight: '-21.4285%',
      marginBottom: '0'
    }}>
      <div className="footer-top" style={{ padding: '0.5rem 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer mobile-app" style={{ marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Mobile Apps</h3>
                <div className="app-button">
                  <a href="javascript:void(0)" className="btn" style={{ padding: '0.2rem 0.3rem' }}>
                    <i className="lni lni-play-store"></i>
                    <span className="text" style={{ fontSize: '0.7rem' }}>
                      <span className="small-text">Get It On</span>
                      Google Play
                    </span>
                  </a>
                  <a href="javascript:void(0)" className="btn" style={{ padding: '0.2rem 0.3rem' }}>
                    <i className="lni lni-apple"></i>
                    <span className="text" style={{ fontSize: '0.7rem' }}>
                      <span className="small-text">Get It On</span>
                      App Store
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer f-link" style={{ marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Locations</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12">
                    <ul style={{ lineHeight: '1.3' }}>
                      <li>
                        <a href="javascript:void(0)">Chicago</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">New York City</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">San Francisco</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Washington</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Boston</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <ul style={{ lineHeight: '1.3' }}>
                      <li>
                        <a href="javascript:void(0)">Los Angeles</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Seattle</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Las Vegas</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">San Diego</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer f-link" style={{ marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Quick Links</h3>
                <ul style={{ lineHeight: '1.3' }}>
                  <li>
                    <a href="javascript:void(0)">About Us</a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">How It's Works</a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">Login</a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">Signup</a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">Help & Support</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer f-contact" style={{ marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Contact</h3>
                <ul style={{ lineHeight: '1.3' }}>
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

      <div className="footer-bottom" style={{ padding: '0.3rem 0' }}>
        <div className="container">
          <div className="inner">
            <div className="row">
              <div className="col-12">
                <div className="content">
                  <ul className="footer-bottom-links" style={{ lineHeight: '1.3', marginBottom: '0.3rem' }}>
                    <li>
                      <a href="javascript:void(0)">Terms of use</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)"> Privacy Policy</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Advanced Search</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Site Map</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Information</a>
                    </li>
                  </ul>
                  <p className="copyright-text" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                    Designed and Developed by
                    <a href="https://graygrids.com/" rel="nofollow" target="_blank">
                      GrayGrids
                    </a>
                  </p>
                  <ul className="footer-social" style={{ marginTop: '0.3rem' }}>
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
                        <i className="lni lni-youtube"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
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
