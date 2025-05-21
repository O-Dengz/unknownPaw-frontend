import {useEffect, useState} from 'react'
import {DashboardSidebar} from '../../components/DashboardSidebar'
import './myPage.css'

export default function Chatting() {
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 검색 로직 구현
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // 메시지 전송 로직 구현
    setMessage('')
  }

  // ✅ 로그인 정보 콘솔 로그 확인
  useEffect(() => {
    const memberData = sessionStorage.getItem('member')
    if (memberData) {
      try {
        const parsed = JSON.parse(memberData)
        console.log('[Chatting 페이지] 로그인된 사용자 정보:', parsed)
      } catch (err) {
        console.error('[Chatting 페이지] sessionStorage member 파싱 오류:', err)
      }
    } else {
      console.log('[Chatting 페이지] 로그인 정보가 없습니다.')
    }
  }, [])

  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">Messages</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>Messages</li>
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
                <div className="messages-container">
                  <div className="messages-header">
                    <h3>Messages</h3>
                    <div className="search-box">
                      <form className="chat-search-form" onSubmit={handleSearch}>
                        <input
                          type="text"
                          placeholder="Search username"
                          name="search"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                          <i className="lni lni-search-alt"></i>
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="messages-content">
                    <div className="users-list">
                      <div className="users-list-inner">
                        <div className="user-item active">
                          <img
                            src="/assets/images/items-grid/author-2.jpg"
                            alt="Laura Cormier"
                          />
                          <div className="user-info">
                            <h4>Laura Cormier</h4>
                            <p>Hi, how are ...</p>
                          </div>
                          <span className="message-count">02</span>
                        </div>

                        <div className="user-item">
                          <img
                            src="/assets/images/items-grid/author-2.jpg"
                            alt="Paul Cox"
                          />
                          <div className="user-info">
                            <h4>Paul Cox</h4>
                            <p>I love your design...</p>
                          </div>
                          <span className="time">NOW</span>
                        </div>

                        <div className="user-item">
                          <img
                            src="/assets/images/items-grid/author-2.jpg"
                            alt="Carlos Dobson"
                          />
                          <div className="user-info">
                            <h4>Carlos Dobson</h4>
                            <p>Hi, how are ...</p>
                          </div>
                          <span className="time">2 mins</span>
                        </div>

                        <div className="user-item">
                          <img
                            src="/assets/images/items-grid/author-2.jpg"
                            alt="Dahia Divers"
                          />
                          <div className="user-info">
                            <h4>Dahia Divers</h4>
                            <p>Nice to meet u ...</p>
                          </div>
                          <span className="time">5 mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="chat-container">
                      <div className="chat-header">
                        <div className="chat-user-info">
                          <img
                            src="/assets/images/items-grid/author-2.jpg"
                            alt="Laura Cormier"
                          />
                          <h4>Laura Cormier</h4>
                        </div>
                      </div>

                      <div className="chat-messages">
                        <div className="message received">
                          <img src="/assets/images/items-grid/author-2.jpg" alt="user" />
                          <div className="message-content">
                            <p>
                              Lorem Ipsum is simply dummy text of the printing and
                              typesetting industry.
                            </p>
                            <span className="time">9:51 AM</span>
                          </div>
                        </div>

                        <div className="message sent">
                          <div className="message-content">
                            <p>
                              Lorem Ipsum is simply dummy text of the printing and
                              typesetting industry.
                            </p>
                            <span className="time">11:00 AM</span>
                          </div>
                        </div>

                        <div className="message received">
                          <img src="/assets/images/items-grid/author-2.jpg" alt="user" />
                          <div className="message-content">
                            <p>
                              Lorem Ipsum is simply dummy text of the printing and
                              typesetting industry.
                            </p>
                            <span className="time">11:05 AM</span>
                          </div>
                        </div>
                      </div>

                      <div className="chat-input">
                        <form onSubmit={handleSendMessage}>
                          <div className="input-group">
                            <button type="button" className="btn-attachment">
                              <i className="lni lni-link"></i>
                            </button>
                            <button type="button" className="btn-attachment">
                              <i className="lni lni-image"></i>
                            </button>
                            <input
                              type="text"
                              placeholder="Type your message here..."
                              value={message}
                              onChange={e => setMessage(e.target.value)}
                            />
                            <button type="submit" className="btn-send">
                              <i className="lni lni-enter"></i>
                            </button>
                          </div>
                        </form>
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
