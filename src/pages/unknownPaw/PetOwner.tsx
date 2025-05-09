import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  profileImagePath?: string
  pawRate?: number
  emailVerified?: boolean
  role?: string
  status?: string
  regDate?: string
}

interface Post {
  postId: number
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  likes?: number
  chatCount?: number
  defaultLocation: string
  regDate: string
  image?: {
    imageId: number
    imagePath: string
    isMain: boolean
  }[]
  member?: MemberResponseDTO
}

interface PageResultDTO {
  dtoList: Post[]
  totalPage: number
  page: number
  size: number
  start: number
  end: number
  prev: boolean
  next: boolean
  pageList: number[]
}

interface PageRequestDTO {
  page: number
  size: number
  type?: string
  keyword?: string
}

export function PetOwner() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageInfo, setPageInfo] = useState<PageResultDTO | null>(null)
  const [pageRequest, setPageRequest] = useState<PageRequestDTO>({
    page: 1,
    size: 10
  })

  useEffect(() => {
    const fetchPosts = () => {
      setLoading(true)
      setError(null)

      const latestToken = sessionStorage.getItem('token')
      if (!latestToken) {
        console.error('No token found in sessionStorage. User is not logged in.')
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      const queryParams = new URLSearchParams({
        page: pageRequest.page.toString(),
        size: pageRequest.size.toString(),
        ...(pageRequest.type && {type: pageRequest.type}),
        ...(pageRequest.keyword && {keyword: pageRequest.keyword})
      })

      fetch(`http://localhost:8080/unknownPaw/api/posts/petowner/list`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${latestToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then((data: PageResultDTO) => {
          setPosts(data.dtoList)
          setPageInfo(data)
        })
        .catch(err => {
          console.error('Error fetching posts:', err)
          setError('게시글을 불러오는데 실패했습니다.')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchPosts()
  }, [pageRequest])

  const handlePageChange = (page: number) => {
    setPageRequest(prev => ({...prev, page}))
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!posts.length) return <div>게시글이 없습니다.</div>

  return (
    <div className="pet-owner-page">
      {/* <!-- Start Items Grid Area --> */}
      <section className="items-grid section custom-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Pet Owner
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  서비스를 요청하고 제안을 받아보세요!
                </p>
              </div>
            </div>
          </div>
          <div className="single-head">
            <div className="row">
              {posts.map((post, index) => (
                <div key={post.postId} className="col-lg-4 col-md-6 col-12">
                  <div
                    className="single-grid wow fadeInUp"
                    data-wow-delay={`.${(index + 1) * 2}s`}>
                    <div className="image">
                      <Link
                        to={`/posts/petowner/read/${post.postId}`}
                        className="thumbnail">
                        <img
                          src={
                            post.image[0]?.imagePath ||
                            'assets/images/items-grid/img1.jpg'
                          }
                          alt="#"
                        />
                      </Link>
                      <div className="author">
                        <div className="author-image">
                          <a href="javascript:void(0)">
                            <img
                              src={
                                post.member?.profileImagePath ||
                                'assets/images/items-grid/author-1.jpg'
                              }
                              alt="#"
                            />
                            <span>{post.member?.nickname || 'Unknown'}</span>
                          </a>
                        </div>
                        <p className="sale">예약하기</p>
                      </div>
                    </div>
                    <div className="content">
                      <div className="top-content">
                        <span className="tag">{post.serviceCategory}</span>
                        <h3 className="title">
                          <Link to={`/posts/petowner/read/${post.postId}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="update-time">
                          {new Date(post.regDate).toLocaleDateString()}
                        </p>
                        <ul className="rating">
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <i className="lni lni-star-filled"></i>
                          </li>
                          <li>
                            <span>({post.likes || 0})</span>
                          </li>
                        </ul>
                        <ul className="info-list">
                          <li>
                            <span>
                              <i className="lni lni-map-marker"></i>{' '}
                              {post.defaultLocation}
                            </span>
                          </li>
                          <li>
                            <span>
                              <i className="lni lni-timer"></i>{' '}
                              {new Date(post.regDate).toLocaleDateString()}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="bottom-content">
                        <p className="price">
                          시급: <span>{post.hourlyRate.toLocaleString()}원</span>
                        </p>
                        <span className="like">
                          <i className="lni lni-heart"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 페이지네이션 UI */}
          {pageInfo && (
            <div className="pagination-area">
              <ul className="pagination">
                {pageInfo.prev && (
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageInfo.start - 1)}>
                      이전
                    </button>
                  </li>
                )}
                {pageInfo.pageList.map(pageNum => (
                  <li
                    key={pageNum}
                    className={`page-item ${pageNum === pageInfo.page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}>
                      {pageNum}
                    </button>
                  </li>
                ))}
                {pageInfo.next && (
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageInfo.end + 1)}>
                      다음
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </section>
      {/* <!-- /End Items Grid Area --> */}
    </div>
  )
}
