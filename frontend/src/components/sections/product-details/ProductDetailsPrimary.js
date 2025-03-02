"use client";
import Image from "next/image";
import Link from "next/link";
import SidebarTopRatedProducs from "@/components/shared/sidebars/widgets/SidebarTopRatedProducs";
import SidebarBanner from "@/components/shared/sidebars/widgets/SidebarBanner";
import { useProductContext } from "@/providers/ProductContext";
import ProductDetailsRight from "@/components/shared/products/ProductDetailsRight";
import { useCommonContext } from "@/providers/CommonContext";
import ProductDetailsTab from "@/components/shared/products/ProductDetailsTab";
import { getImageUrl } from "@/utils/getImageUrl";

const ProductDetailsPrimary = ({ product }) => {
  // hooks
  const { isNotSidebar, type } = useCommonContext();
  const { setCurrentProduct } = useProductContext();

  const {
    name,
    id,
    description,
    base_price,
    sale_price,
    reviews_count,
    categories,
    colors,
    sizes,
  } = product;

  const images = product.images.map((image) => ({
    url: getImageUrl(image.image_data.url),
    alt: image.alt_text,
  }));

  const rightSideData = {
    id,
    name,
    sale_price,
    base_price,
    reviews_count,
    categories,
    colors,
    sizes,
    image: images[0],
  };

  return (
    <div
      className={`ltn__shop-details-area  ${
        type === 1 || type === 2 ? "pb-85" : "pb-120"
      }`}
      onMouseEnter={() => setCurrentProduct(rightSideData)}
    >
      <div className="container">
        <div className="row">
          <div className={` ${isNotSidebar ? "" : "col-lg-8"} col-md-12`}>
            <div
              className={`ltn__shop-details-inner ${
                type === 1 || type === 2 ? "mb-60" : ""
              }`}
            >
              <div className="row">
                <div className={isNotSidebar ? "col-lg-6" : "col-md-6"}>
                  <div className="ltn__shop-details-img-gallery">
                    <div className="ltn__shop-details-large-img">
                      {images?.map(({ url, alt }, idx) => (
                        <div key={idx} className="single-large-img">
                          <Link href={url} data-rel="lightcase:myCollection">
                            <Image
                              src={url}
                              alt={alt}
                              width={1000}
                              height={1000}
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="ltn__shop-details-small-img slick-arrow-2">
                      {images?.map(({ url, alt }, idx) => (
                        <div key={idx} className="single-small-img">
                          <Image
                            src={url}
                            alt={alt}
                            width={1000}
                            height={1000}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={isNotSidebar ? "col-lg-6" : "col-md-6"}>
                  {/*  */}
                  <ProductDetailsRight product={rightSideData} />
                </div>
              </div>
            </div>
            {/* <!-- Shop Tab Start --> */}
            {type === 1 || type === 2 ? (
              <ProductDetailsTab
                product={rightSideData}
                description={description}
              />
            ) : (
              ""
            )}
            {/* <!-- Shop Tab End --> */}
          </div>
          {isNotSidebar ? (
            ""
          ) : (
            <div className="col-lg-4">
              <aside className="sidebar ltn__shop-sidebar ltn__right-sidebar">
                {/* <!-- Top Rated Product Widget --> */}
                <SidebarTopRatedProducs />

                {/* <!-- Banner Widget --> */}
                <SidebarBanner
                  image={"/img/banner/2.jpg"}
                  imgWidth={740}
                  imgHeight={440}
                />
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPrimary;
