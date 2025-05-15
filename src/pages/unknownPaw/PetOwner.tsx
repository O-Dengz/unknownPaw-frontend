import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Pagination} from '../../components/Pagination'
import {formatTimeAgo} from '../../utils/timeAgo'

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
  content: Post[]
}

interface PageRequestDTO {
  page: number
  size: number
  type?: string
  keyword?: string
}

export function PetOwner() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageInfo, setPageInfo] = useState<PageResultDTO | null>(null)
  const [pageRequest, setPageRequest] = useState<PageRequestDTO>({
    page: 1,
    size: 10
  })

  useEffect(() => {
    console.log('>>> pageRequest 변경:', pageRequest)
    console.log('>>> Posts 상태 (useEffect 시작):', posts)
    const fetchPosts = () => {
      setLoading(true)
      setError(null)

      const latestToken = sessionStorage.getItem('token')
      console.log('>>> 토큰 값:', latestToken)

      if (!latestToken) {
        console.error('No token found in sessionStorage. User is not logged in.')
        setError('로그인이 필요합니다.')
        setLoading(false)
        navigate('/login')
        return
      }

      const queryParams = new URLSearchParams({
        page: pageRequest.page.toString(),
        size: pageRequest.size.toString(),
        ...(pageRequest.type && {type: pageRequest.type}),
        ...(pageRequest.keyword && {keyword: pageRequest.keyword})
      })

      console.log('>>> 요청 파라미터:', queryParams.toString())

      fetch(`/api/posts/petowner/list?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${latestToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
        .then(async response => {
          console.log('>>> Response received:', response)
          if (!response.ok) {
            const errorText = await response.text()
            console.error('Error response:', errorText)

            if (response.status === 401 || response.status === 403) {
              sessionStorage.removeItem('token')
              navigate('/login')
              throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
            }
            throw new Error(`서버 오류: ${errorText || response.status}`)
          }
          return response.json()
        })
        .then((data: PageResultDTO) => {
          console.log('>>> API 응답 데이터:', data)
          console.log('>>> API 응답 데이터 pageInfo.pageList:', data.pageList)
          if (data.content) {
            console.log('>>> 첫 번째 게시글 데이터:', data.content[0])
            setPosts(prevPosts => [...data.content] as Post[])
            console.log('>>> Posts 상태 업데이트 (then):', posts)
          }
          setPageInfo(data)
        })
        .catch(err => {
          console.error('Error fetching posts:', err)
          setError(err.message || '게시글을 불러오는데 실패했습니다.')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchPosts()
  }, [pageRequest, navigate])

  const handlePageChange = (page: number) => {
    setPageRequest(prev => ({...prev, page}))
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="pet-owner-page">
      {/* */}
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
              {!loading && posts?.length > 0 ? (
                posts?.map((post, index) => (
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
                              post.image?.[0]?.imagePath ||
                              '../assets/images/items-grid/img1.jpg'
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
                                  '../assets/images/items-grid/author-1.jpg'
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
                            {/* 3일 전 */}
                            {formatTimeAgo(post.regDate)}
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
                ))
              ) : !loading && posts?.length === 0 ? (
                <div className="col-12">게시글이 없습니다.</div>
              ) : null}
            </div>
          </div>

          {pageInfo && !loading && (
            <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
          )}
        </div>
      </section>
    </div>
  )
}
