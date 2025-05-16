import { Link } from 'react-router-dom'

function Navbar() {

  return (
    <div className="ui massive borderless menu" style={{ backgroundColor: 'var(--company-color)', position: 'sticky', top: '0', fontWeight: 'bolder', zIndex: 100, boxShadow: '1px 5px 10px -6px rgba(71,71,71,1)' }}>

      <div className="ui container">
        <div className="item" id="brand-name">
          JLDB v2
        </div>

        <div className="right menu">
          <Link to="/" className="item">Database</Link>
          <Link to="/faq" className="item">FAQ</Link>
        </div>

      </div>

    </div >
  )
}

export default Navbar;
