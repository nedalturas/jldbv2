import { Link } from 'react-router-dom'

function Navbar(){
  
  return(
    <div className="ui top borderless sticky menu">
      
      <div className="ui container">
        <div className="item" id="brand-name">
          JLDB v2
        </div>

        <div className="right menu">
          <Link to="/" className="item">Database</Link>
          <Link to="/faq" className="item">FAQ</Link>
        </div>

      </div>

    </div>
  )
} 

export default Navbar;
