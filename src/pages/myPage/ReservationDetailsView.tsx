import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import {DashboardSidebar} from '../../components/DashboardSidebar'

interface ReservationDetails {
  rno: number
  type: string
  date: string
  owner: string
  sitter?: string
  petName: string
  duration: string
  price: string
  rating: string
  chat?: string
  location: string
  petId: number | null // ✅ 추가: 역할 구분용
}

export default function ReservationDetailsView() {
  const {rno} = useParams<{rno: string}>()
  const [detail, setDetail] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'owner' | 'sitter'>('owner') // ✅ 역할 구분 상태

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(`/api/appointment/${rno}`)
        setDetail(response.data as ReservationDetails)

        // ✅ petId 유무로 맡긴/맡은 예약 구분
        const isOwner = !!response.data.petId
        setViewMode(isOwner ? 'owner' : 'sitter')
      } catch (err) {
        setError('상세 정보를 불러오지 못했습니다.')
        console.error('Error fetching reservation details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (rno) {
      fetchDetail()
    }
  }, [rno])

  return (
    <div className="page-wrapper">
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h1 className="page-title">예약 상세 정보</h1>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>예약 상세 정보</li>
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
                    <h3 className="block-title mb-0">예약 정보</h3>
                    <Link to="/reservation-details" className="btn btn-outline-primary">
                      목록으로
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      <p>불러오는 중...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  ) : !detail ? (
                    <div className="text-center py-4">
                      <p>데이터가 없습니다.</p>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <h5 className="mb-3">서비스 정보</h5>
                            <div className="mb-3">
                              <label className="text-muted">서비스 종류</label>
                              <p className="mb-0">{detail.type}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted">날짜</label>
                              <p className="mb-0">{detail.date}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted">서비스 시간</label>
                              <p className="mb-0">{detail.duration}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted">시급</label>
                              <p className="mb-0">{detail.price}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted">채팅 메시지</label>
                              <p className="mb-0">{detail.chat || '없음'}</p>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <h5 className="mb-3">회원 정보</h5>
                            {viewMode === 'owner' ? (
                              // 내가 맡긴 예약 → 상대는 시터
                              <div className="mb-3">
                                <label className="text-muted">펫시터</label>
                                <p className="mb-0">{detail.sitter || '알 수 없음'}</p>
                              </div>
                            ) : (
                              // 내가 맡은 예약 → 상대는 오너
                              <div className="mb-3">
                                <label className="text-muted">펫 오너</label>
                                <p className="mb-0">{detail.owner || '알 수 없음'}</p>
                              </div>
                            )}

                            <div className="mb-3">
                              <label className="text-muted">반려동물</label>
                              <p className="mb-0">{detail.petName}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted">평점</label>
                              <p className="mb-0">{detail.rating}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted">위치</label>
                              <p className="mb-0">{detail.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
