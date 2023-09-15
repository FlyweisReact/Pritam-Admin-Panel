/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HOC from "../../layout/HOC";

const SingleProduct = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [colorId, setColorId] = useState(null);

  const BaseUrl = "https://krish-vapes-backend.vercel.app/";
  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getOrder = async () => {
    try {
      const response = await axios.get(`${BaseUrl}api/v1/Product/${id}`);
      setData(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const getImageLink = (item) => {
    if (item?.productId?.colorActive === true) {
      return item?.productColorId?.img;
    } else {
      return item?.productId?.img;
    }
  };

  
  function ValueChecker(holder, string) {
    return holder ? (
      <Form.Group className="mb-3">
        <Form.Label> {string} </Form.Label>
        <Form.Control placeholder={holder} disabled />
      </Form.Group>
    ) : (
      ""
    );
  }

  // Size Modal
  function SizeModal(props) {
    const [size, setSize] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [sizeName, setSizeName] = useState("");
    const [quantityDigit, setQuantityDigit] = useState("");

    const sizeSelector = (item) => {
      setSize((prev) => [...prev, item]);
      setSizeName("");
    };

    const RemoveSize = (index) => {
      setSize((prev) => prev.filter((_, i) => i !== index));
    };

    const quantitySelector = (item) => {
      setQuantity((prev) => [...prev, item]);
      setQuantityDigit("");
    };

    const RemoveQuantity = (index) => {
      setQuantity((prev) => prev.filter((_, i) => i !== index));
    };

    const payload = { size, quantity };

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.put(
          `https://krish-vapes-backend.vercel.app/api/v1/Product/addProductColorSize/${colorId}`,
          payload,
          Auth
        );
        toast.success(res.data.message);
        props.onHide()
        getOrder()
      } catch (e) {
        console.log(e);
        const err = e.response.data.message;
        toast.error(err);
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Size and Quantity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "90%", margin: "0" }}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setSizeName(e.target.value)}
                    value={sizeName}
                  />
                </div>
                <i
                  className="fa-solid fa-plus"
                  onClick={() => sizeSelector(sizeName)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
              <ul className="mt-2">
                {size?.map((i, index) => (
                  <li
                    key={index}
                    onClick={() => RemoveSize(index)}
                    style={{ listStyle: "disc" }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      {i}{" "}
                      <i
                        className="fa-solid fa-minus ml-2 "
                        style={{ cursor: "pointer" }}
                      ></i>
                    </span>
                  </li>
                ))}
              </ul>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "90%", margin: "0" }}>
                  <Form.Control
                    type="number"
                    min={0}
                    onChange={(e) => setQuantityDigit(e.target.value)}
                    value={quantityDigit}
                  />
                </div>
                <i
                  className="fa-solid fa-plus"
                  onClick={() => quantitySelector(quantityDigit)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
              <ul className="mt-2">
                {quantity?.map((i, index) => (
                  <li
                    key={index}
                    onClick={() => RemoveQuantity(index)}
                    style={{ listStyle: "disc" }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      {i}{" "}
                      <i
                        className="fa-solid fa-minus ml-2 "
                        style={{ cursor: "pointer" }}
                      ></i>
                    </span>
                  </li>
                ))}
              </ul>
            </Form.Group>

            <Button type="submit" variant="success">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <SizeModal show={modalShow} onHide={() => setModalShow(false)} />
      <section>
        <p className="headP">Dashboard / {data?.name}</p>
        <section className="sectionCont">
          <Form>
            <div className="img-cont">
              {data?.colors
                ? data?.colors?.map((i) => (
                    <img
                      src={i.img}
                      alt=""
                      className="centerImage"
                      key={i._id}
                    />
                  ))
                : ""}
            </div>
            <img src={getImageLink(data)} alt="" className="centerImage" />
            {ValueChecker(data?.name, "Product Name")}
            {ValueChecker(data?.description, "Description")}
            {ValueChecker(data?.price, "Price")}
            {ValueChecker(data?.quantity, "Quantity")}
            {ValueChecker(data?.discountPrice, "Discount Price")}
            {ValueChecker(data?.tax, "Tax")}
            {ValueChecker(data?.ratings, "Ratings")}

            {data?.colors
              ? data?.colors?.map((i , index) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                    key={index}
                  >
                    <Form.Group className="mb-3" style={{ width: "90%" }}>
                      <Form.Label>Colors </Form.Label>

                      <Form.Control
                        placeholder={i.color}
                        disabled
                        className="mt-2"
                      />
                      <div
                        style={{
                          backgroundColor: "#e9ecef",
                          width: "100%",
                          marginTop: "10px",
                        }}
                      >
                        <ul style={{ listStyle: "disc" }}>
                          {i.colorSize?.map((item) => (
                            <li key={item._id}>
                              {" "}
                              {item.size}{" "}
                              {item.quantity
                                ? ` , Quantity  : ${item.quantity}`
                                : ""}{" "}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Form.Group>

                    <i
                      className="fa-solid fa-plus"
                      onClick={() => {
                        setColorId(i._id);
                        setModalShow(true);
                      }}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                ))
              : ""}

            {ValueChecker(data?.createdAt?.slice(0, 10), "Created At")}

            <Link to="/Product">
              <Button variant="dark">Back</Button>
            </Link>
          </Form>
        </section>
      </section>
    </>
  );
};

export default HOC(SingleProduct);
