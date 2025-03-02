"use client";

import CheckoutProduct from "@/components/shared/checkout/CheckoutProduct";
import Nodata from "@/components/shared/no-data/Nodata";
import countTotalPrice from "@/libs/countTotalPrice";
import getAllProducts from "@/libs/getAllProducts";
import modifyAmount from "@/libs/modifyAmount";
import { useCartContext } from "@/providers/CartContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
const paymnetImage3 = "/img/icons/payment-3.png";
import useSweetAlert from "@/hooks/useSweetAlert";
import { useEffect, useState } from "react";
import Link from "next/link";
import productService from "@/services/product.service";
import { getImageUrl } from "@/utils/getImageUrl";
import customerService from "@/services/customer.service";
import Swal from "sweetalert2";
import orderServices from "@/services/order.service";
import { MONEY_SIGN } from "@/constants";

const CheckoutPrimary = () => {
  // get Initial data
  const [paymentMethods, setPaymentMethods] = useState();
  const [currentMethod, setCurrentMethod] = useState();

  const [delivery_areas, setDeliveryAreas] = useState();
  const [area, setArea] = useState();

  const [customer, setCustomer] = useState();

  const initialData = async () => {
    const [methods, delivery_areas, isCustomer] = await Promise.all([
      productService.getPaymentMethods(),
      productService.getDeliveryAreas(),
      customerService.getCustomer(),
    ]);

    setPaymentMethods(methods);
    setCurrentMethod(methods[0].id);

    setDeliveryAreas(delivery_areas);
    setArea(delivery_areas[0]);

    setCustomer(isCustomer);
  };

  const handleCurrentMethod = (id) => {
    setCurrentMethod(id);
  };

  useEffect(() => {
    initialData();
  }, []);

  const initCheckoutData = {
    name: "",
    number: "",
    address: "",
  };

  const [checkoutData, setCheckoutData] = useState({ ...initCheckoutData });

  const handleCheckoutChange = (e) => {
    setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (customer) {
      setCheckoutData({
        name: customer.name,
        address: customer.address,
        number: customer.number,
      });
    }
  }, [customer]);

  const [products, setProducts] = useState();
  const [subTotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    let countSubtotal = 0;
    let countDiscount = 0;

    const productsItem = cart?.map((item) => {
      const total = Number(item.base_price) * item.quantity;

      countSubtotal += total;
      countDiscount +=
        (Number(item.base_price) - Number(item.price)) * item.quantity;

      return { ...item, total };
    });

    setSubtotal(countSubtotal);
    setDiscount(countDiscount);
    setProducts(productsItem);
  }, []);

  // handle delvery area selction
  useEffect(() => {
    const handleNiceSelect = () => {
      const niceSelect = document.querySelector('select[name="area"]');
      if (niceSelect) {
        const niceSelectInputs =
          niceSelect.nextElementSibling?.querySelectorAll("ul li");
        niceSelectInputs?.forEach((input) => {
          input.addEventListener("click", function () {
            const index = this.getAttribute("data-value");
            setArea(delivery_areas[index]);
          });
        });
      }
    };

    // Create an interval to check for the elements
    const checkInterval = setInterval(() => {
      const niceSelect = document.querySelector('select[name="area"]');
      if (
        niceSelect?.nextElementSibling?.querySelectorAll("ul li").length > 0
      ) {
        handleNiceSelect();
        clearInterval(checkInterval);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
    };
  }, [delivery_areas]);

  // create order
  const handleOrder = async (e) => {
    e.preventDefault();

    const { name, number, address } = checkoutData;

    if (!name || !number || !address || !delivery_areas) {
      Swal.fire({ icon: "error", title: "please fillup all required fields" });
    }

    // confirm at least one product included
    if (!products || products.length < 1) {
      Swal.fire({ icon: "error", text: "add at least one product" });
      return;
    }

    // check if customer exist
    if (!customer) {
      const newCustomer = await customerService.createCustomer({
        name,
        number,
        address,
      });
      setCustomer(newCustomer);
    }

    // if customer exist but information is defferent update customer with diferent data
    if (
      customer &&
      (customer.name !== name ||
        customer.address !== address ||
        customer.number !== number)
    ) {
      let updateData = {};
      if (customer.name !== name) {
        updateData.name = name;
      }
      if (customer.address !== address) {
        updateData.address = address;
      }
      if (customer.number !== number) {
        updateData.number = number;
      }

      await customerService.updateCustomer({
        id: customer.id,
        data: updateData,
      });
    }

    const items = products.map((item) => ({
      product_id: item.id,
      color_id: item.color_id,
      size_id: item.size_id,
      quantity: item.quantity,
    }));

    // create order
    await orderServices.createOrder({
      shipping_address: address,
      number,
      payment_method_id: currentMethod,
      delivery_area_id: area.id,
      products: items,
    });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "your order has been created successfully",
    });
    localStorage.removeItem("cart");
    setProducts();
  };

  return (
    <div className="ltn__checkout-area mb-105">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__checkout-inner">
              {/* login */}
              {/* <div className="ltn__checkout-single-content ltn__returning-customer-wrap">
                <h5>
                  Returning customer?{" "}
                  <Link
                    className="ltn__secondary-color"
                    href="#ltn__returning-customer-login"
                    data-bs-toggle="collapse"
                  >
                    Click here to login
                  </Link>
                </h5>
                <div
                  id="ltn__returning-customer-login"
                  className="collapse ltn__checkout-single-content-info"
                >
                  <div className="ltn_coupon-code-form ltn__form-box">
                    <p>Please login your accont.</p>
                    <form action="#">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-item input-item-name ltn__custom-icon">
                            <input
                              type="text"
                              name="ltn__name"
                              placeholder="Enter your name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-item input-item-email ltn__custom-icon">
                            <input
                              type="email"
                              name="ltn__email"
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                      <button className="btn theme-btn-1 btn-effect-1 text-uppercase">
                        Login
                      </button>
                      <label className="input-info-save mb-0">
                        <input type="checkbox" name="agree" /> Remember me
                      </label>
                      <p className="mt-30">
                        <Link href="/register">Lost your password?</Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div> */}
              {/* coupon */}
              {/* <div className="ltn__checkout-single-content ltn__coupon-code-wrap">
                <h5>
                  Have a coupon?{" "}
                  <Link
                    className="ltn__secondary-color"
                    href="#ltn__coupon-code"
                    data-bs-toggle="collapse"
                  >
                    Click here to enter your code
                  </Link>
                </h5>
                <div
                  id="ltn__coupon-code"
                  className="collapse ltn__checkout-single-content-info"
                >
                  <div className="ltn__coupon-code-form">
                    <p>If you have a coupon code, please apply it below.</p>
                    <form action="#">
                      <input
                        type="text"
                        name="coupon-code"
                        placeholder="Coupon code"
                      />
                      <button className="btn theme-btn-2 btn-effect-2 text-uppercase">
                        Apply Coupon
                      </button>
                    </form>
                  </div>
                </div>
              </div> */}
              {/* buyer info */}
              <div className="ltn__checkout-single-content mt-50">
                <h4 className="title-2">Billing Details</h4>
                <div className="ltn__checkout-single-content-info">
                  <form id="checkout-form" onSubmit={handleOrder}>
                    <h6>Personal Information</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-item input-item-name ltn__custom-icon">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={checkoutData.name}
                            onChange={handleCheckoutChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-item input-item-phone ltn__custom-icon">
                          <input
                            type="text"
                            name="number"
                            value={checkoutData.number}
                            placeholder="Phone number"
                            onChange={handleCheckoutChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className=" col-md-6">
                        <h6>Delivery Area</h6>
                        <div className="input-item">
                          <select className="nice-select" name="area">
                            {delivery_areas?.map((delivery_area, index) => (
                              <option key={delivery_area.id} value={index}>
                                {delivery_area.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <h6>Address</h6>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="input-item">
                              <input
                                type="text"
                                placeholder="House number and street name"
                                name="address"
                                value={checkoutData.address}
                                onChange={handleCheckoutChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* payment methods */}
          <div className="col-lg-6">
            <div className="ltn__checkout-payment-method mt-50">
              <h4 className="title-2">Payment Method</h4>

              <div id="checkoutAccordion" className="accordion">
                {/* <!-- card --> */}
                {paymentMethods?.map((method) => (
                  <div
                    className="card"
                    key={method.id}
                    onClick={() => {
                      handleCurrentMethod(method.id);
                    }}
                  >
                    <h5
                      className="ltn__card-title"
                      data-bs-toggle="collapse"
                      data-bs-target={`#chechoutCollapse${method.id}`}
                      aria-expanded={
                        method.id === currentMethod ? "true" : "false"
                      }
                    >
                      {method.name}
                      <Image
                        src={getImageUrl(method.image_data.url)}
                        alt={method.image_data.name}
                        width={131}
                        height={120}
                      />
                    </h5>
                    <div
                      id={`chechoutCollapse${method.id}`}
                      className={`accordion-collapse collapse ${
                        method.id === currentMethod ? "show" : ""
                      }`}
                      data-bs-parent="#checkoutAccordion"
                    >
                      <div className="card-body">
                        <p>{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ltn__payment-note mt-30 mb-30">
                <p>
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our privacy policy.
                </p>
              </div>
              <button
                className="btn theme-btn-1 btn-effect-1 text-uppercase"
                type="submit"
                form="checkout-form"
              >
                Place order
              </button>
            </div>
          </div>
          {/* product to buy */}
          <div className="col-lg-6">
            {!products ? (
              <Nodata text={"No Product!"} />
            ) : (
              <div className="shoping-cart-total mt-50">
                <h4 className="title-2">Cart Totals</h4>
                <table className="table">
                  <tbody>
                    {products?.map((product) => (
                      <CheckoutProduct key={product.id} product={product} />
                    ))}

                    <tr>
                      <td>Delivery Charge</td>
                      <td>
                        {MONEY_SIGN}
                        {area?.charge}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>Discount</td>
                      <td>
                        {" "}
                        - {MONEY_SIGN}
                        {discount}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>Vat</td>
                      <td>{MONEY_SIGN}00.00</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Order Total</strong>
                      </td>
                      <td>
                        <strong>
                          {MONEY_SIGN}
                          {modifyAmount(
                            subTotal - discount + (area?.charge || 0)
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPrimary;
