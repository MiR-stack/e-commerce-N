"use client";
import ProductCardPrimary from "@/components/shared/cards/ProductCardPrimary";
import ProductCardPrimary2 from "@/components/shared/cards/ProductCardPrimary2";
import Nodata from "@/components/shared/no-data/Nodata";
import CustomPagination from "@/components/shared/paginations/CustomPagination";
import ShopDataShowing from "@/components/shared/products/ShopDataShowing";
import ShopShortSelect from "@/components/shared/products/ShopShortSelect";
import ProductSidebar from "@/components/shared/sidebars/ProductSidebar";

import Link from "next/link";
import React, { useState } from "react";

const ProductsPrimary = ({
  isSidebar,
  currentTapId,
  handleSort,
  products,
  pagination,
  handlePage,
}) => {
  const [currentTab, setCurrentTab] = useState(currentTapId ? currentTapId : 0);

  const tabControllers = ["fas fa-th-large", "fas fa-list"];

  const lastItem = pagination?.page * pagination?.limit;
  const firstItem = lastItem - pagination?.limit + 1;

  return (
    <div className="ltn__product-area ltn__product-gutter mb-120">
      <div className="container">
        <div className="row">
          <div
            className={`${isSidebar === false ? "col-lg-12" : "col-lg-8"}  ${
              isSidebar === "left" ? "order-lg-2 " : ""
            }`}
          >
            {!pagination?.totalPages ? (
              <Nodata text={"No Product Found!"} />
            ) : (
              ""
            )}

            <div
              className={`ltn__shop-options ${
                !pagination?.totalPages ? "no-data" : ""
              }`}
            >
              <ul>
                <li>
                  <div className="ltn__grid-list-tab-menu ">
                    <div className="nav">
                      {tabControllers?.map((iconName, idx) => (
                        <Link
                          key={idx}
                          onClick={() => setCurrentTab(idx)}
                          className={idx === currentTab ? "active " : ""}
                          data-bs-toggle="tab"
                          href={`#liton_product_${idx + 1}`}
                        >
                          <i className={iconName}></i>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
                <li>
                  {isSidebar === "left" || isSidebar === false ? (
                    <ShopShortSelect handleSort={handleSort} />
                  ) : (
                    <ShopDataShowing
                      limit={pagination?.limit}
                      totalItems={pagination?.total}
                      firstItem={firstItem}
                      lastItem={lastItem}
                    />
                  )}
                </li>
                <li>
                  {isSidebar === "left" || isSidebar === false ? (
                    <ShopDataShowing
                      limit={pagination?.limit}
                      totalItems={pagination?.total}
                      firstItem={firstItem}
                      lastItem={lastItem}
                    />
                  ) : (
                    <ShopShortSelect handleSort={handleSort} />
                  )}
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div
                className={`tab-pane fade ${
                  currentTab === 0 ? " active " : ""
                }`}
                id="liton_product_1"
              >
                <div className="ltn__product-tab-content-inner ltn__product-grid-view">
                  <div className="row">
                    {/* <!-- ltn__product-item --> */}
                    {products?.map((product, idx) => (
                      <div
                        className={`${
                          isSidebar === false ? "col-xl-3 col-lg-4" : "col-xl-4"
                        }  col-sm-6 col-6`}
                        key={idx}
                      >
                        <ProductCardPrimary product={product} />
                      </div>
                    ))}

                    {/* <!--  --> */}
                  </div>
                </div>
              </div>
              <div
                className={`tab-pane fade ${currentTab === 1 ? " active" : ""}`}
                id="liton_product_2"
              >
                <div className="ltn__product-tab-content-inner ltn__product-list-view">
                  <div className="row">
                    {/* <!-- ltn__product-item --> */}
                    {products?.map((product, idx) => (
                      <div className="col-lg-12" key={idx}>
                        <ProductCardPrimary2 product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {pagination?.totalPages > 1 ? (
              <CustomPagination
                totalPages={pagination?.totalPages}
                currentPage={pagination?.page}
                onPageChange={handlePage}
              />
            ) : (
              ""
            )}
          </div>
          {isSidebar === false ? (
            ""
          ) : (
            <div className="col-lg-4">
              <ProductSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPrimary;
