// src/pages/myPage/MyPosts.tsx

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardSidebar } from '../../components/DashboardSidebar'
import { Link } from 'react-router-dom'
import './myPage.css'

interface PostItem {
  id: number
  title: string
  regDate: string
  likes: number
  imageUrl?: string
  category?: string
}

type TabType = 'PET_OWNER' | 'PET_SITTER' | 'COMMUNITY'

interface ApiError {
  response?: { status: number; statusText: string }
  request?: any
  message?: string
}

export default function MyPosts() {
  const [activeTab, setActiveTab] = useState<TabType>('PET_OWNER')
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPosts = async (type: TabType) => {
    try {
      setLoading(true)
      setError('')
      const memberString = sessionStorage.getItem('member')
      const token = sessionStorage.getItem('token')
      const member = memberString ? JSON.parse(memberString) : null
      const mid = member?.mid

      if (!mid || !token) throw new Error('로그인이 필요합니다.')

      const urlMap: Record<TabType, string> = {
        PET_OWNER: `/api/posts/petowner/${mid}`,
        PET_SITTER: `/api/posts/petsitter/${mid}`,
        COMMUNITY: `/api/community/${mid}`
      }

      const response = await axios.get(urlMap[type], {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPosts(response.data as PostItem[])
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
    fetchPosts(activeTab)
  }, [activeTab])

  return (
    <div className="page-wrapper">
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">내가 쓴 글</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>내가 쓴 글</li>
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
                <h2 className="mb-4">내가 쓴 글</h2>

                <div className="tab-buttons mb-3 d-flex gap-2">
                  {(['PET_OWNER', 'PET_SITTER', 'COMMUNITY'] as TabType[]).map(tab => (
                    <button
                      key={tab}
                      className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'
                        }`}
                      onClick={() => setActiveTab(tab)}>
                      {tab === 'PET_OWNER'
                        ? '펫오너'
                        : tab === 'PET_SITTER'
                          ? '펫시터'
                          : '커뮤니티'}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <p>불러오는 중...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : posts.length === 0 ? (
                  <p>작성한 글이 없습니다.</p>
                ) : (
                  posts.map(post => (
                    <div
                      key={post.id}
                      className="post-card p-3 border rounded mb-3 shadow-sm d-flex gap-3 align-items-center">
                      <img
                        src={post.imageUrl || '/assets/images/default-thumbnail.jpg'}
                        alt="thumbnail"
                        style={{ width: 120, height: 80, objectFit: 'cover' }}
                      />
                      <div>
                        <h5>{post.title}</h5>
                        <p>작성일: {post.regDate}</p>
                        <p>좋아요 ❤️: {post.likes}</p>
                        {post.category && <p>카테고리: {post.category}</p>}
                        <Link
                          to={`/posts/${post.postType.toLowerCase()}/read/${post.id}`}
                          className="btn btn-outline-primary w-100 mt-2"
                        >
                          상세보기
                        </Link>


                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
