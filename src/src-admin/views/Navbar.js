import "../Dashboard.js";
import "./Navbar.css";

const signout = () => {
    console.log("signout button clicked");

    sessionStorage.setItem('email',null);
    window.location.reload();
  };

const Navbar = () => (
    <header className='navbar'>
        <div className='navbar__title navbar_item'>
            <a href="https://www.bimsignbank.org/home" target="_blank" rel="noopener noreferrer">
                <img src="https://www.bimsignbank.org/static/media/bim-logo.95848318.jpg" alt="bimlogo" width="15%" height="5%"/>
            </a><br></br><br></br>
            <button onClick={() => signout()}>SIGN OUT</button></div>
        <div className='navbar__item' id="headerright"><h2>BIM Sign Bank Administration</h2></div>
      
        <div className='navbar__item' >
            <a href="https://www.mymfdeaf.org/pengenalan">
                <img src="https://www.bimsignbank.org/static/media/mfd-logo.9567e887.jpg" alt="link" width="60%" height="10%" />
            </a>
            
        </div>
        
        <div className='navbar__item' >
            <a href="https://careers.guidewire.com/guidewire-gives-back">
                <img src="https://www.bimsignbank.org/static/media/ggb-logo.d044fc73.jpg" alt="link" width="20%" />
            </a>
        </div>
    </header>
);
export default Navbar;