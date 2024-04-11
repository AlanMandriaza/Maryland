import Link from 'next/link';


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link href="/"> 
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/">
                <span className="nav-link active" aria-current="page">Inicio</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/productos">
                <span className="nav-link">Inventario</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/pedido">
                <span className="nav-link">Pedido</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
