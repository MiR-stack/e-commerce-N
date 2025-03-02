"use client";
import Image from "next/image";
const logoImage = "/img/logo.png";
const logoImage2 = "/img/logo-2.png";
import Link from "next/link";
import { useFooterContex } from "@/providers/FooterContext";

const FooterAbout2 = () => {
  const { footerStyle, footerBg } = useFooterContex();
  return (
    <div className="col-xl-3 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-about-widget">
        <div className="footer-logo mb-10">
          <div className="site-logo">
            <Image
              src={footerBg === "dark" ? logoImage2 : logoImage}
              alt="Logo"
              width={154}
              height={42}
            />
          </div>
        </div>
        <p>
          Welcome to our e-commerce store, your go-to destination for a diverse
          range of quality products at competitive prices. We are dedicated to
          providing a seamless, secure shopping experience that meets your
          everyday needs.
        </p>
        <div className="footer-address">
          <ul>
            <li>
              <div className="footer-address-icon">
                <i className="icon-placeholder"></i>
              </div>
              <div className="footer-address-info">
                <p>Mirpur 1, Dhaka, Bangladesh</p>
              </div>
            </li>
            <li>
              <div className="footer-address-icon">
                <i className="icon-call"></i>
              </div>
              <div className="footer-address-info">
                <p>
                  <Link href="tel:+880187933077">+880 187933077</Link>
                </p>
              </div>
            </li>
            <li>
              <div className="footer-address-icon">
                <i className="icon-mail"></i>
              </div>
              <div className="footer-address-info">
                <p>
                  <Link href="mailto:contact@heavenjourney.com">
                    contact@heavenjourney.com
                  </Link>
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="ltn__social-media mt-20">
          <ul>
            <li>
              <Link href="#" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </Link>
            </li>{" "}
            <li>
              <Link href="#" title="Twitter">
                <i className="fab fa-twitter"></i>
              </Link>
            </li>{" "}
            <li>
              <Link href="#" title="Linkedin">
                <i className="fab fa-linkedin"></i>
              </Link>
            </li>{" "}
            <li>
              <Link href="#" title="Youtube">
                <i className="fab fa-youtube"></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterAbout2;
