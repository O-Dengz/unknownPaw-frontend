import {useState} from 'react'
import {DashboardSidebar} from '../../components/DashboardSidebar'

export default function Faq() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('collapseOne')

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">Frequently Asked Questions</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>FAQ</li>
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
                        <span>How do I place an ad?</span>
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
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                          consectetur sit amet ante nec vulputate. Nulla aliquam, justo
                          auctor consequat tincidunt, arcu erat mattis lorem, lacinia
                          lacinia dui enim at eros. Pellentesque ut gravida augue. Duis ac
                          dictum tellus
                        </p>
                        <p>
                          Anim pariatur cliche reprehenderit, enim eiusmod high life
                          accusamus terry richardson ad squid. 3 wolf moon officia aute.
                          non cupidatat skateboard dolor brunch. Foosd truck quinoa
                          nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt alqua
                          put a bird on it squid single-origin coffee nulla assumenda
                          shoreditch et. Nihil anim ke ffiyeh helvetica, craft beer labore
                          wes anderson cred nesciunt sapiente ea proident.
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
                        <span>Who shouldi to contact if i Have any question?</span>
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
                          Anim pariatur cliche reprehenderit, enim eiusmod high life
                          accusamus terry richardson ad squid. 3 wolf moon officia aute.
                          non cupidatat skateboard dolor brunch. Foosd truck quinoa
                          nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt alqua
                          put a bird on it squid single-origin coffee nulla assumenda
                          shoreditch et. Nihil anim ke ffiyeh helvetica, craft beer labore
                          wes anderson cred nesciunt sapiente ea proident.
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                          consectetur sit amet ante nec vulputate. Nulla aliquam, justo
                          auctor consequat tincidunt, arcu erat mattis lorem, lacinia
                          lacinia dui enim at eros. Pellentesque ut gravida augue. Duis ac
                          dictum tellus
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
                        <span>How can i cancel or change my order?</span>
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
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                          Voluptas expedita, repellendus est nemo cum quibusdam optio,
                          voluptate hic a tempora facere, nihil non itaque alias similique
                          quas quam odit consequatur.
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
                        <span>How can i Return A Product?</span>
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
                          Anim pariatur cliche reprehenderit, enim eiusmod high life
                          accusamus terry richardson ad squid. 3 wolf moon officia aute.
                          non cupidatat skateboard dolor brunch. Foosd truck quinoa
                          nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt alqua
                          put a bird on it squid single-origin coffee nulla assumenda
                          shoreditch et.
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                          Provident iure ab nisi, magnam vitae. Laboriosam laborum
                          suscipit recusandae officia laudantium, consectetur adipisci
                          voluptates doloremque quisquam. Id rerum iusto reprehenderit
                          assumenda!
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
                        <span>How Long will it take to get my package?</span>
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
                          Anim pariatur cliche reprehenderit, enim eiusmod high life
                          accusamus terry richardson ad squid. 3 wolf moon officia aute.
                          non cupidatat skateboard dolor brunch. Foosd truck quinoa
                          nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt alqua
                          put a bird on it squid single-origin coffee nulla assumenda
                          shoreditch et.{' '}
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
                          <h2>Our Contacts & Location</h2>
                          <p>
                            Business consulting excepteur sint occaecat cupidatat
                            consulting non proident.
                          </p>
                        </div>
                        <div className="single-info">
                          <h3>Opening hours</h3>
                          <ul>
                            <li>Daily: 9.30 AM–6.00 PM</li>
                            <li>Sunday & Holidays: Closed</li>
                          </ul>
                        </div>
                        <div className="single-info">
                          <h3>Contact info</h3>
                          <ul>
                            <li>77408 Satterfield Motorway Suite</li>
                            <li>469 New Antonetta, BC K3L6P6</li>
                            <li>
                              <a href="mailto:info@yourwebsite.com">example@info.com</a>
                            </li>
                            <li>
                              <a href="tel:(617) 495-9400-326">(617) 495-9400-326</a>
                            </li>
                          </ul>
                        </div>
                        <div className="single-info contact-social">
                          <h3>Social contact</h3>
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
                                <i className="lni lni-linkedin-original"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="lni lni-pinterest"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 col-12">
                      <div className="contact-form-wrapper">
                        <div className="form-title">
                          <h2>Get in Touch</h2>
                          <p>
                            There are many variations of passages of Lorem Ipsum
                            available, but the majority have suffered alteration in some
                            form.
                          </p>
                        </div>
                        <form className="form" onSubmit={e => e.preventDefault()}>
                          <div className="row">
                            <div className="col-lg-6 col-12">
                              <div className="form-group">
                                <input
                                  name="name"
                                  type="text"
                                  placeholder="Your Name"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-12">
                              <div className="form-group">
                                <input
                                  name="subject"
                                  type="text"
                                  placeholder="Your Subject"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-12">
                              <div className="form-group">
                                <input
                                  name="email"
                                  type="email"
                                  placeholder="Your Email"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-12">
                              <div className="form-group">
                                <input
                                  name="phone"
                                  type="text"
                                  placeholder="Your Phone"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group message">
                                <textarea
                                  name="message"
                                  placeholder="Your Message"></textarea>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group button">
                                <button type="submit" className="btn">
                                  Submit Message
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
                          width="100%"
                          height="500"
                          id="gmap_canvas"
                          src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
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
  )
}
