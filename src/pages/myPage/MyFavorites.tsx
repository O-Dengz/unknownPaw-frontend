import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar'
import {Link} from 'react-router-dom'
import './myPage.css'

interface FavoriteItem {
  id: number
  title: string
  regDate: string
  likes: number
  imageUrl?: string
  category?: string
  postType: 'PET_OWNER' | 'PET_SITTER' | 'COMMUNITY'
}

interface ApiError {
  response?: {status: number; statusText: string}
  request?: any
  message?: string
}

export default function MyFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      setError('')
      const memberString = sessionStorage.getItem('member')
      const token = sessionStorage.getItem('token')
      const member = memberString ? JSON.parse(memberString) : null
      const mid = member?.mid

      if (!mid || !token) throw new Error('로그인이 필요합니다.')

      const postTypes = ['PET_OWNER', 'PET_SITTER']
      const requests = postTypes.map(type =>
        axios.get(
          `http://localhost:8080/unknownPaw/api/posts/likes/${type}?memberId=${mid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      )

      const responses = await Promise.all(requests)
      const merged = responses.flatMap(res => res.data as FavoriteItem[])

      setFavorites(merged)
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.response) {
        setError(
          `불러오기 실패 (${apiError.response.status}: ${apiError.response.statusText})`
        )
      } else if (apiError.request) {
        setError('서버에 연결할 수 없습니다.')
      } else {
        setError(err instanceof Error ? err.message : '알 수 없는 오류 발생')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'PET_OWNER':
        return '펫오너'
      case 'PET_SITTER':
        return '펫시터'
      case 'COMMUNITY':
        return '커뮤니티'
      default:
        return type
    }
  }

  return (
    <div className="page-wrapper">
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">좋아요 한 게시글</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>좋아요 한 게시글</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardSidebar />
            </div>

            <div className="col-lg-9">
              <div className="main-content">
                <h2 className="mb-4">좋아요 한 게시글</h2>

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    좋아요 한 글이 없습니다.
                  </div>
                ) : (
                  <div className="row">
                    {favorites.map(favorite => (
                      <div key={favorite.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm">
                          <img
                            src={
                              favorite.imageUrl || '/assets/images/default-thumbnail.jpg'
                            }
                            className="card-img-top"
                            alt={favorite.title}
                            style={{height: '200px', objectFit: 'cover'}}
                          />
                          <div className="card-body">
                            <h5 className="card-title text-truncate">{favorite.title}</h5>
                            <div className="card-text">
                              <p className="mb-1">
                                <small className="text-muted">
                                  작성일: {favorite.regDate}
                                </small>
                              </p>
                              <p className="mb-1">
                                <span className="text-danger">❤️ {favorite.likes}</span>
                              </p>
                              <p className="mb-1">
                                <span className="badge bg-primary">
                                  {getPostTypeLabel(favorite.postType)}
                                </span>
                                {favorite.category && (
                                  <span className="badge bg-secondary ms-1">
                                    {favorite.category}
                                  </span>
                                )}
                              </p>
                            </div>
                            <Link
                              to={`/post/${favorite.id}`}
                              className="btn btn-outline-primary w-100 mt-2">
                              상세보기
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
