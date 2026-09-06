import { Link } from "react-router-dom";

function Footer({ children, username, id }) {
  const url = `/user/edit/${username}`;
  const url2 = `/promblem/view/${id}`;
  const url3 = `/promblem/new/${id}`;
  const url4 = `/community/${id}`;

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 ">
        <div className="row justify-content-center  space-between mb-4">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body text-center">
                <Link to={url2} className="card-link">
                  → View-Problem
                </Link>
              </div>
            </div>
            <div className="card mb-3">
              <div className="card-body text-center">
                <Link to={url4} className="card-link">
                  → Community
                </Link>
              </div>
            </div>
            <div className="card mb-3">
              <div className="card-body text-center">
                <Link to="/code" className="card-link">
                  → CodeEditor
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-3" style={{ marginBottom: "400px" }}>
          <center>{children}</center>
        </div>
      </div>
      <footer className="bg-dark text-white text-center p-3">
        &copy; 2024 ZCoder. All rights reserved.
      </footer>
    </div>
  );
}

export default Footer;
