import Link from "next/link";
import React from "react";

const FooterCompany = () => {
  return (
    <div className="col-xl-2 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-menu-widget clearfix">
        <h4 className="footer-title">Company</h4>
        <div className="footer-menu">
          <ul>
            <li>
              <Link href="#">About</Link>
            </li>
            <li>
              <Link href="#">Blog</Link>
            </li>
            <li>
              <Link href="/shop">All Products</Link>
            </li>
            <li>
              <Link href="#">Locations Map</Link>
            </li>
            <li>
              <Link href="#">FAQ</Link>
            </li>
            <li>
              <Link href="#">Contact us</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterCompany;
