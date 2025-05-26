import React from 'react'

function PageNotFound() {
  return (
    <div className="ui container" style={{ marginTop: '4em' }}>
      <div className="" style={{
        width: '100%',
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '4em 2em'
      }}>
        <div className="ui icon header" style={{
          color: '#999',
          marginBottom: '2em',
          fontSize: '2.5em'
        }}>
          <i className="sad tear icon" style={{
            fontSize: '4em',
            color: 'var(--company-color)',
            marginBottom: '0.5em'
          }}></i>
          <div className="content" style={{ fontSize: '1.5em', fontWeight: 'normal' }}>
            Page not found
            <div className="sub header" style={{
              fontSize: '0.4em',
              color: '#666',
              marginTop: '1em',
              lineHeight: '1.5'
            }}>
              You may have browsed too far, the dev said you are lost.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PageNotFound 
