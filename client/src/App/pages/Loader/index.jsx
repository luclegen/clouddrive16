import React from 'react'

export default function Loader() {
  return <main>
    <section className="section-only section-loader">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </section>
  </main>
}
