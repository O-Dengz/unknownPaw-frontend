import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {DashboardSidebar} from '../../components/DashboardSidebar'
import './myPage.css'

interface Item {
  id: number
  title: string
  price: string
  location: string
  category: string
  status: string
  image: string
}

export default function MyItems() {
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      title: '강아지 산책 서비스',
      price: '15,000원/시간',
      location: '부산시 수영구',
      category: '산책',
      status: '진행중',
      image: '/assets/images/pet/dog-1.jpg'
    },
    {
      id: 2,
      title: '고양이 돌봄 서비스',
      price: '20,000원/시간',
      location: '부산시 기장군',
      category: '돌봄',
      status: '완료',
      image: '/assets/images/pet/dog-1.jpg'
    },
    {
      id: 3,
      title: '강아지 장기 돌봄',
      price: '50,000원/일',
      location: '부산시 강서구',
      category: '돌봄',
      status: '진행중',
      image: '/assets/images/pet/dog-1.jpg'
    },
    {
      id: 4,
      title: '반려동물 호텔링 서비스',
      price: '35,000원/일',
      location: '부산시 금정구',
      category: '호텔링',
      status: '예약중',
      image: '/assets/images/pet/dog-1.jpg'
    }
  ])

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?')
    if (confirmed) {
      setItems(prevItems => prevItems.filter(item => item.id !== id))
    }
  }

  const total = items.length
  const inProgress = items.filter(item => item.status === '진행중').length
  const reserved = items.filter(item => item.status === '예약중').length
  const completed = items.filter(item => item.status === '완료').length

  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">내 게시글</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>내 게시글</li>
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
                <div className="dashboard-block mt-0">
                  <div className="service-list">
                    <div className="service-header">
                      <div className="row">
                        <div className="col-12">
                          <div className="header-info">
                            <span>전체 {total}</span>
                            <span>진행중 {inProgress}</span>
                            <span>예약중 {reserved}</span>
                            <span>완료 {completed}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="service-items">
                      {items.map(item => (
                        <div key={item.id} className="service-item">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-title">
                                <img src={item.image} alt={item.title} />
                                <div className="title-info">
                                  <h3>{item.title}</h3>
                                  <p className="price">{item.price}</p>
                                  <p className="location">{item.location}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-category">
                                <span>{item.category}</span>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-status">
                                <div className="status-bar">
                                  <div className={`status-progress ${item.status}`}></div>
                                </div>
                                <span className="status-text">{item.status}</span>
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-actions">
                                <Link
                                  to="#"
                                  onClick={() => alert('수정 기능은 준비 중입니다.')}
                                  className="action-btn edit">
                                  <i className="lni lni-pencil"></i>
                                </Link>
                                <Link to={`/post/${item.id}`} className="action-btn view">
                                  <i className="lni lni-eye"></i>
                                </Link>
                                <Link
                                  to="#"
                                  onClick={() => handleDelete(item.id)}
                                  className="action-btn delete">
                                  <i className="lni lni-trash"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pagination">
                      <ul className="pagination-list">
                        <li>
                          <Link to="#">1</Link>
                        </li>
                        <li className="active">
                          <Link to="#">2</Link>
                        </li>
                        <li>
                          <Link to="#">3</Link>
                        </li>
                        <li>
                          <Link to="#">4</Link>
                        </li>
                        <li>
                          <Link to="#">
                            <i className="lni lni-chevron-right"></i>
                          </Link>
                        </li>
                      </ul>
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
