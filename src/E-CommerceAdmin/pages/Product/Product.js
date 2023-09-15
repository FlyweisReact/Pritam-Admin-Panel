/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Table, Badge, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import SpinnerComp from "../Component/SpinnerComp";
import { Link } from "react-router-dom";

const Product = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://krish-vapes-backend.vercel.app/api/v1/Product/all/paginateProductSearch?page=${page}&limit=10&search=${query}`
      );
      setData(data.data);
      setTotal(data.data.total);
    } catch (e) {
      console.log(e);
    }
  };

  function Prev() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function Next() {
    setPage(page + 1);
  }

  const getImageLink = (item) => {
    if (item?.colorActive === true) {
      return item?.colors?.[0]?.img;
    } else {
      return item?.img;
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, query]);

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(
        `https://krish-vapes-backend.vercel.app/api/v1/Product/deleteProduct/${id}`,
        Auth
      );
      toast.success(data.message);
      fetchData();
    } catch (e) {
      const msg = e.response.data.message;
      toast.error(msg);
    }
  };

  return (
    <>
      <p className="headP">Dashboard / Products</p>

      <div
        className="pb-4  w-full flex justify-between items-center"
        style={{ width: "98%", marginLeft: "2%" }}
      >
        <span
          className="tracking-widest text-slate-900 font-semibold uppercase"
          style={{ fontSize: "1.5rem" }}
        >
          All Product's ( Total : {total} )
        </span>
        <div className="d-flex gap-1">
          <Link to="/create-product">
            <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#19376d] text-white tracking-wider">
              Create Product
            </button>
          </Link>
        </div>
      </div>

      <section className="sectionCont">
        {data?.length === 0 || !data ? (
          <SpinnerComp />
        ) : (
          <>
            <div className="filterBox">
              <img
                src="https://t4.ftcdn.net/jpg/01/41/97/61/360_F_141976137_kQrdYIvfn3e0RT1EWbZOmQciOKLMgCwG.jpg"
                alt=""
              />
              <input
                type="search"
                placeholder="Start typing to search for products"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="overFlowCont">
              {data?.docs?.length === 0 || !data ? (
                <Alert>No Product Found</Alert>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>Sno.</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>MRP</th>
                      <th>Selling Price</th>
                      <th>Cost Price</th>
                      <th>Total Stock</th>
                      <th>Category</th>
                      <th>VAT</th>
                      <th>VAT % </th>
                      <th>Margin</th>
                      <th> Options </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.docs?.map((i, index) => (
                      <tr key={index}>
                        <td> #{index + 1} </td>
                        <td style={{ cursor: "pointer" }}>
                          <div className="CarouselImages">
                            <img src={getImageLink(i)} alt="" />
                          </div>
                        </td>

                        <td> {i.name} </td>
                        <td> £{i.price} </td>
                        <td>£{i.discountPrice}</td>
                        <td> {i.costPrice ? `£${i.costPrice}` : ""} </td>
                        <td>
                          {i.quantity >= 10 ? (
                            <Badge bg="success">{i.quantity} In Stock</Badge>
                          ) : (
                            <Badge bg="danger">{i.quantity} In Stock</Badge>
                          )}
                        </td>
                        <td>{i.categoryId?.name}</td>
                        <td> {i.taxInclude === false ? "No" : "Yes"} </td>
                        <td> {i.taxInclude === false ? `${i.tax}%` : ""} </td>
                        <td> {i.marginPrice} </td>
                        <td>
                          <span className="flexCont">
                            <Link to={`/edit-product/${i._id}`}>
                              <i className="fa-solid fa-pen-to-square" />
                            </Link>
                            <Link to={`/product/${i._id}`}>
                              <i className="fa-solid fa-eye" />
                            </Link>
                            <i
                              className="fa-sharp fa-solid fa-trash"
                              onClick={() => deleteHandler(i._id)}
                            ></i>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <div className="pagination">
                <button onClick={() => Prev()} className="prevBtn">
                  <i className="fa-solid fa-backward"></i>
                </button>

                <button className="activePage">{page}</button>

                <button onClick={() => Next()} className="nextBtn">
                  {" "}
                  <i className="fa-sharp fa-solid fa-forward"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default HOC(Product);
