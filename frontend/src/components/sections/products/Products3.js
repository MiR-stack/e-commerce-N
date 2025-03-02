import ProductCardPrimary from "@/components/shared/cards/ProductCardPrimary";
import { api } from "@/libs/api";
import getAllProducts from "@/libs/getAllProducts";
import makePath from "@/libs/makePath";
import Link from "next/link";

const Products3 = async ({ title, desc, isSmallTitle, pt, type, isDouble }) => {
  // get 4 categories
  const categories = await api.categories.list({
    fields: "name,id",
    limit: 4,
    sortBy: "productCount",
    sortOrder: "desc",
  });

  const [
    products1,
    products2,
    products3,
    products4,
    products5,
    products6,
    products7,
    products8,
  ] = formatedProducts(categories?.data);

  const products = await api.products.list({
    fields:
      "id,name,slug,images,categories(name,id),sale_price,base_price,createdAt,colors(id,name,hex_code),sizes(id,name)",
    limit: 12,
  });
  const products9 = products?.data.slice(0, 6);
  const products10 = products?.data.slice(6, 12);

  let tabs = ["All"];
  categories?.data.forEach((category) => {
    tabs.push(category.name);
  });

  return (
    <section>
      <div
        className={`ltn__product-tab-area ltn__product-gutter  pb-70 ${
          pt ? pt : "pt-115"
        }`}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className={`section-title-area  ${
                  type === 2
                    ? ""
                    : isSmallTitle
                    ? "text-center"
                    : "ltn__section-title-2 text-center"
                }`}
              >
                <h1 className="section-title">
                  {title ? title : "Our Products"}
                </h1>
                {desc ? (
                  <p>
                    A highly efficient slip-ring scanner for {"today's"}{" "}
                    diagnostic requirements.
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div
                className={`ltn__tab-menu ltn__tab-menu-2 ${
                  type === 2 ? "ltn__tab-menu-top-right" : ""
                }  text-uppercase text-center`}
              >
                <div className="nav">
                  {tabs.map((tab, idx) => (
                    <Link
                      className={idx === 0 ? "active show" : ""}
                      data-bs-toggle="tab"
                      href={`#liton_tab_3_${idx + 1}`}
                    >
                      {tab}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="tab-content">
                <div className="tab-pane fade active show" id="liton_tab_3_1">
                  <div className="ltn__product-tab-content-inner">
                    <div className="row ltn__tab-product-slider-one-active slick-arrow-1">
                      {products9?.map((product, idx) => (
                        <div className="col-lg-12" key={idx}>
                          <ProductCardPrimary product={product} />
                          {isDouble ? (
                            <ProductCardPrimary product={products10[idx]} />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="liton_tab_3_2">
                  <div className="ltn__product-tab-content-inner">
                    <div className="row ltn__tab-product-slider-one-active slick-arrow-1">
                      {/* <!-- ltn__product-item --> */}
                      {products1?.map((product, idx) => (
                        <div className="col-lg-12" key={idx}>
                          <ProductCardPrimary product={product} />
                          {isDouble ? (
                            <ProductCardPrimary product={products2[idx]} />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                      {/* <!--  --> */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="liton_tab_3_3">
                  <div className="ltn__product-tab-content-inner">
                    <div className="row ltn__tab-product-slider-one-active slick-arrow-1">
                      {/* <!-- ltn__product-item --> */}
                      {products3?.map((product, idx) => (
                        <div className="col-lg-12" key={idx}>
                          <ProductCardPrimary product={product} />
                          {isDouble ? (
                            <ProductCardPrimary product={products4[idx]} />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {type === 2 ? (
                  ""
                ) : (
                  <div className="tab-pane fade" id="liton_tab_3_4">
                    <div className="ltn__product-tab-content-inner">
                      <div className="row ltn__tab-product-slider-one-active slick-arrow-1">
                        {/* <!-- ltn__product-item --> */}
                        {products5?.map((product, idx) => (
                          <div className="col-lg-12" key={idx}>
                            <ProductCardPrimary product={product} />
                            {isDouble ? (
                              <ProductCardPrimary product={products6[idx]} />
                            ) : (
                              ""
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="tab-pane fade" id="liton_tab_3_5">
                  <div className="ltn__product-tab-content-inner">
                    <div className="row ltn__tab-product-slider-one-active slick-arrow-1">
                      {/* <!-- ltn__product-item --> */}
                      {products7?.map((product, idx) => (
                        <div className="col-lg-12" key={idx}>
                          <ProductCardPrimary product={product} />
                          {isDouble ? (
                            <ProductCardPrimary product={products8[idx]} />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const formatedProducts = (categories) => {
  let products = [];
  categories?.forEach((item) => {
    products.push(item.products.slice(0, 6), item.products.slice(6, 12));
  });

  return products;
};

export default Products3;
