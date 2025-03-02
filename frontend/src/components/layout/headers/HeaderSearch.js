"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HeaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState();
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${searchTerm}`);
  };

  return (
    <div className="col header-contact-serarch-column d-none d-lg-block">
      <div className="header-contact-search">
        {/* <!-- header-feature-item --> */}
        <div className="header-feature-item">
          <div className="header-feature-icon">
            <i className="icon-call"></i>
          </div>
          <div className="header-feature-info">
            <h6>Phone</h6>
            <p>
              <a href="tel:+880187933077">+880 187933077</a>
            </p>
          </div>
        </div>
        {/* <!-- header-search-2 --> */}
        <div className="header-search-2">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearchTerm}
            />
            <button type="submit">
              <span>
                <i className="icon-search"></i>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
