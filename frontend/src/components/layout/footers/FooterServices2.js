import Link from "next/link";
import React from "react";

const FooterServices2 = () => {
  return (
    <div className="col-xl-2 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-menu-widget clearfix">
        <h4 className="footer-title">Services.</h4>
        <div className="footer-menu">
          <ul>
            <li>
              <Link href="#">Order tracking</Link>
            </li>
            <li>
              <Link href="#">Wish List</Link>
            </li>
            <li>
              <Link href="#">Login</Link>
            </li>
            <li>
              <Link href="#">My account</Link>
            </li>
            <li>
              <Link href="#">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="#">Promotional Offers</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterServices2;
