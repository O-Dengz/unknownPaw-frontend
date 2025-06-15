import React from 'react'
import {DashboardSidebar} from './DashboardSidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  breadcrumbs?: Array<{
    label: string
    path?: string
  }>
}

export function DashboardLayout({
  children,
  title,
  breadcrumbs = []
}: DashboardLayoutProps) {
  return (
    <div className="page-wrapper">
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">{title}</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index}>
                    {crumb.path ? <a href={crumb.path}>{crumb.label}</a> : crumb.label}
                  </li>
                ))}
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
              <div className="main-content">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
