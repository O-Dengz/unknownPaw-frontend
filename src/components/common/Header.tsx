import React from 'react'
import {Link} from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header-inner">
              <div className="logo">
                <Link to="/">
                  <img src="/assets/images/logo/logo.png" alt="UnknownPaw" />
                </Link>
              </div>
              <div className="main-menu">
                <nav className="nav-menu">
                  <ul>
                    <li>
                      <Link to="/">홈</Link>
                    </li>
                    <li>
                      <Link to="/petowner/list">반려인</Link>
                    </li>
                    <li>
                      <Link to="/petsitter/list">펫시터</Link>
                    </li>
                    <li>
                      <Link to="/community">커뮤니티</Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="header-right">
                <div className="button">
                  <Link to="/login" className="btn">
                    로그인
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
