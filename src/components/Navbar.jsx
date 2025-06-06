import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {

  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className={`${styles.navbar} ui massive borderless menu`}>

      <div className="ui container">
        <div className={`${styles.navbar_brand} item`} id="brand-name">
          JLDB v2
        </div>

        <div className={`${styles.navbar_links} right menu`}>
          <Link to="/" className="item" style={{
            backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderBottom: isActive('/') ? '2px solid white' : 'none'
          }}>Database</Link>
          <Link to="/faq" className="item" style={{
            backgroundColor: isActive('/faq') ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderBottom: isActive('/faq') ? '2px solid white' : 'none'
          }}>Updates</Link>
        </div>

      </div>

    </div >
  )
}

export default Navbar;