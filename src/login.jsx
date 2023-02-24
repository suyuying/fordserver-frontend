import React, { useEffect, useState } from "react";
import { createBrowserHistory } from "history";

import ReactDOM from "react-dom/client";
import {
  Form,
  redirect,
  Link,
  useActionData,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

export async function action({ request, params }) {
  let url = `http://127.0.0.1:8000/token`;
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  let formBody = [];
  console.log(Object.fromEntries(formData));
  for (let property in formDataObject) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(formDataObject[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  let formRequest = new Request(url, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    credentials: "include",
    // Object.fromEntries(formData); 相當於以下事情
    // name: formData.get("name"), //單純就是取key值
    body: formBody,

    // email: formData.get("email"), //單純就是取key值

    // body: JSON.stringify(Object.fromEntries(formData)),
  });
  console.log(formBody);

  // return promise,用 than 或 await取resolve or reject
  let req = await fetch(formRequest);

  // 200~200 req.ok為true，之外為false
  if (!req.ok) {
    const errorResponse = await req.json(); //用json才會用utf-8,不然都會是別的格式，這可以問一下
    for (const [key, value] of Object.entries(errorResponse)) {
      console.log(`key: ${key}  value:  ${value} `);
    }
    // status 要丟，不然他會直接當作200，所以以下算是公式
    throw new Response(JSON.stringify(errorResponse.detail), {
      status: req.status,
    });
  } else {
    const successResponse = await req.json();
    let history = createBrowserHistory();
    //這個判斷也很重要，因為會遇到直接按登入的情況
    const oldlocation =
      (history.location &&
        history.location.state &&
        history.location.state.pathname) ||
      "/";
    //這部很重要把目前login位置換成上一頁情況，這樣user案上一頁就不會跑回去login
    history.replace(oldlocation);
    console.log(`this is ${oldlocation}`);
    return redirect(oldlocation);
  }
}
export default function Login() {
  console.log("login page");

  return (
    <>
      <section className="flex flex-col md:flex-row h-scree items-center">
        <div className=" hidden lg:block h-full max-h-[750px] overflow-hidden md:w-1/2 xl:w-2/3 ">
          <img
            src="https://source.unsplash.com/random"
            alt=""
            className="mx-auto w-3/4"
            //max-width: 100%;
          />
        </div>
        <div
          className=" w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-full px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
        >
          <div className="w-full h-100">
            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
              Log in to your account
            </h1>
            <Form className="mt-6" method="post">
              <div>
                <label className="block text-gray-700">username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username "
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  autoFocus
                  autoComplete="true"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
                  autoFocus
                  autoComplete="true"
                  required
                />
              </div>
              <div className="text-right mt-2">
                <Link
                  to="#"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
                value="Submit"
              >
                Login
              </button>
            </Form>
            <hr className="my-6 border-gray-300 w-full" />
            <button
              type="button"
              className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="w-6 h-6"
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <path
                      id="Link"
                      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                    />
                  </defs>
                  <clipPath id="b">
                    <use xlinkto="#Link" overflow="visible" />
                  </clipPath>
                  <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                  <path
                    clipPath="url(#b)"
                    fill="#EA4335"
                    d="M0 11l17 13 7-6.1L48 14V0H0z"
                  />
                  <path
                    clipPath="url(#b)"
                    fill="#34A853"
                    d="M0 37l30-23 7.9 1L48 0v48H0z"
                  />
                  <path
                    clipPath="url(#b)"
                    fill="#4285F4"
                    d="M48 48L17 24l-4-3 35-10z"
                  />
                </svg>
                <span className="ml-4">Log in with Google</span>
              </div>
            </button>
            <p className="mt-8">
              Need an account?
              <Link
                to="/createmember"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}