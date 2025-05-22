import { Link, useLocation } from 'react-router-dom'

function Navbar() {

  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="ui massive borderless menu" style={{ backgroundColor: 'var(--company-color)', position: 'sticky', top: '0', fontWeight: 'bolder', zIndex: 100, boxShadow: '1px 5px 10px -6px rgba(71,71,71,1)' }}>

      <div className="ui container">
        <div className="item" id="brand-name">
          JLDB v2
        </div>

        <div className="right menu">
          <Link to="/" className="item" style={{ 
              backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderBottom: isActive('/') ? '2px solid white' : 'none'
            }}>Database</Link>
          <Link to="/faq" className="item" style={{ 
              backgroundColor: isActive('/faq') ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderBottom: isActive('/faq') ? '2px solid white' : 'none'
            }}
>FAQ</Link>
        </div>

      </div>

    </div >
  )
}

export default Navbar;
