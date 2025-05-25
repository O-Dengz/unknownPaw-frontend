
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {DashboardSidebar} from '../../components/DashboardSidebar'
import {ReservationEditModal} from '../../components/ReservationEditModal'

type ReservationDetailsItem = {
  rno: number
  type: '산책' | '돌봄' | '호텔'
  date: string
  owner: string
  petName: string
  duration: string
  price: string
  rating: string
  confirmationDate: string
  futureDate: string
  defaultLocation: string
  decideHourRate: number
  serviceCategory: 'WALK' | 'CARE' | 'HOTEL'
  mid: number
  petId: number
  postId: number
  postType?: 'PET_OWNER' | 'PET_SITTER'
}

export default function ReservationDetails() {
  const [originalData, setOriginalData] = useState<ReservationDetailsItem[]>([])
  const [tab, setTab] = useState<'owner' | 'sitter'>('owner')
  const [filterType, setFilterType] = useState<'전체' | '산책' | '돌봄' | '호텔'>('전체')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetailsItem | null>(null)

  const itemsPerPage = 5
  const pagesPerGroup = 10

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const memberString = sessionStorage.getItem('member')
      const member = memberString ? JSON.parse(memberString) : null
      const mid = member?.mid
      if (!mid) throw new Error('로그인이 필요합니다.')
      const response = await axios.get<ReservationDetailsItem[]>(`/api/appointment/member/${mid}`)
      if (!response.data) throw new Error('데이터가 없습니다.')
      setOriginalData(response.data)
    } catch (err) {
      const apiError = err as any
      setError(apiError?.response?.statusText || '알 수 없는 오류 발생')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredByTab = originalData.filter(item => {
    const isOwner = item.petId !== null && item.petId !== undefined
    return tab === 'owner' ? isOwner : !isOwner
  })

  const filteredByTypeAndDate = filteredByTab.filter(item => {
    const matchType = filterType === '전체' || item.type === filterType
    const matchStart = !startDate || new Date(item.date) >= new Date(startDate)
    const matchEnd = !endDate || new Date(item.date) <= new Date(endDate)
    return matchType && matchStart && matchEnd
  })

  const totalPages = Math.ceil(filteredByTypeAndDate.length / itemsPerPage)
  const currentGroup = Math.ceil(currentPage / pagesPerGroup)
  const startPage = (currentGroup - 1) * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)
  const pageNumbers = Array.from(
    {length: endPage - startPage + 1},
    (_, i) => startPage + i
  )

  const currentItems = filteredByTypeAndDate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h1 className="page-title">예약 내역</h1>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li><Link to="/">Home</Link></li>
                <li>예약 내역</li>
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
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="block-title mb-0">{tab === 'owner' ? '내가 맡긴 예약' : '내가 맡은 예약'}</h3>
                    <div className="btn-group">
                      <button className={`btn ${tab === 'owner' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setTab('owner')}>맡긴 예약</button>
                      <button className={`btn ${tab === 'sitter' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setTab('sitter')}>맡은 예약</button>
                    </div>
                  </div>

                  <div className="mb-3 d-flex gap-3 align-items-center flex-wrap">
                    <select
                      className="form-select"
                      style={{maxWidth: '150px'}}
                      value={filterType}
                      onChange={e => setFilterType(e.target.value as typeof filterType)}>
                      <option value="전체">전체</option>
                      <option value="산책">산책</option>
                      <option value="돌봄">돌봄</option>
                      <option value="호텔">호텔</option>
                    </select>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="form-control"
                      style={{maxWidth: '160px'}}
                    />
                    <span>~</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="form-control"
                      style={{maxWidth: '160px'}}
                    />
                    <button className="btn btn-sm btn-primary" onClick={() => setCurrentPage(1)}>
                      조회
                    </button>
                  </div>

                  <div className="inner-block">
                    {loading ? (
                      <p>불러오는 중...</p>
                    ) : error ? (
                      <p className="text-danger">{error}</p>
                    ) : currentItems.length > 0 ? (
                      <>
                        {currentItems.map(service => (
                          <div key={service.rno} className="single-service mb-4 p-3 border rounded shadow-sm">
                            <div className="service-info">
                              <h4 className="mb-2">{service.type} 서비스</h4>
                              <p><strong>날짜:</strong> {service.date}</p>
                              <p><strong>펫 주인:</strong> {service.owner}</p>
                              <p><strong>반려동물:</strong> {service.petName}</p>
                              <p><strong>서비스 시간:</strong> {service.duration}</p>
                              <p><strong>시급:</strong> {service.price}</p>
                              <p><strong>평점:</strong> <span className="rating">{service.rating}</span></p>
                            </div>
                            <div className="service-actions mt-3">
                              <Link to={`/reservation-details/${service.rno}`} className="btn btn-primary">상세보기</Link>
                              <button
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => setSelectedReservation({
                                  ...service,
                                  postId: service.postId,
                                  postType: service.petId ? 'PET_SITTER' : 'PET_OWNER'
                                })}>
                                수정
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="pagination mt-4 d-flex flex-wrap gap-1">
                          {currentPage > 1 && (
                            <button className="btn btn-light btn-sm border" onClick={() => setCurrentPage(1)}>처음</button>
                          )}
                          {startPage > 1 && (
                            <button className="btn btn-light btn-sm border" onClick={() => setCurrentPage(startPage - 1)}>&lt;</button>
                          )}
                          {pageNumbers.map(number => (
                            <button key={number} onClick={() => setCurrentPage(number)} className={`btn btn-sm border ${number === currentPage ? 'btn-dark text-white' : 'btn-light'}`}>
                              {number}
                            </button>
                          ))}
                          {endPage < totalPages && (
                            <button className="btn btn-light btn-sm border" onClick={() => setCurrentPage(endPage + 1)}>&gt;</button>
                          )}
                          {currentPage < totalPages && (
                            <button className="btn btn-light btn-sm border" onClick={() => setCurrentPage(totalPages)}>마지막</button>
                          )}
                        </div>
                      </>
                    ) : (
                      <p>조건에 맞는 서비스 내역이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
S
      <ReservationEditModal
        isOpen={selectedReservation !== null}
        onClose={() => setSelectedReservation(null)}
        reservation={selectedReservation!}
        onUpdate={fetchData}
      />
    </div>
  )
}
