import Image from "next/image";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { setCookie } from 'cookies-next';
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    let data = { ...form };
    data[e.target.name] = e.target.value;
    setForm(data);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(`${process.env.base_url}/auth/login`, form, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            const token = response.data.access_token;
            const username = response.data.user.username;
            const role = response.data.user.roleName;
            const id = response.data.user.id;
            Swal.fire({
              icon: "success",
              text: "Login Successfully.",
            });
            console.log(response, "responses")
            localStorage.setItem(
              "username",
              JSON.stringify(username)
            );
            localStorage.setItem(
              "role",
              JSON.stringify(role)
            );
            localStorage.setItem(
              "userId",
              JSON.stringify(id)
            );
            setCookie('access_token', token, {
              // maxAge: 60 * 60 * 24 * 7,
              // path: '/', 
            })
            router.push('/documents')
            console.log(response, "response");
            console.log(token, "access_token");
          }
        }
        );
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: "An error occured",
      });
    }

  };
  // bg-[#20288E]
  return (
    <div className="h-screen w-full flex bg-gradient-to-r from-[#2956A4] via-[#2963A4DB] to-[#FFFFFFAE] opacity-80 items-center justify-center z-0 relative">
      <Image
        className="dark:invert w-full h-full object-cover"
        src="/images/bg_full.png"
        alt="Next.js logo"
        width={1000}
        height={1000}
        priority
      />
      <div className="flex md:flex-row flex-col gap-[10%] w-[95%] z-1 mx-auto h-full md:h-[80vh] rounded-3xl absolute  overflow-hidden">
        <div className="w-full md:w-[55%] mx-auto justify-center">
          <Image
            className="dark:invert object-cover m-auto py-5"
            src="/images/logo-peruri.png"
            alt="Next.js logo"
            width={250}
            height={250}
            priority
          />
          <h1 className=" text-white text-center text-lg md:text-xl ">FixHub Platform for IT Service Management  (ITSM)
          </h1>

        </div>
        <div className="w-full md:w-[45%] flex items-center justify-center 2 h-full">
          <div className="bg-white opacity-75 shadow-gray-400 shadow-xl backdrop-blur-sm w-full h-full flex rounded-3xl overflow-hidden p-4 justify-center">
          </div>
          <div
            className={`flex items-center absolute gap-16 rounded-3xl m-auto h-full font-[family-name:var(--font-geist-sans)] p-7 w-full md:w-[40%]`}
          >
            <div className="text-black mx-auto flex items-center flex-col w-full">
              <h1 className="text-black text-lg md:text-2xl font-semibold mb-8 w-full text-center pb-8">Sign in</h1>
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 row-start-2 items-center sm:items-center w-full min-h-[80%] rounded-3xl">
                <div className="flex items-center justify-between w-full ">
                  <label htmlFor="email" className="w-[35%]">
                    Email*
                  </label>
                  <input
                    type="text"
                    id="email"
                    required
                    value={form.email}
                    name="email"
                    placeholder="Input email.."
                    onChange={handleChange}
                    className="border rounded-md w-[65%] p-1 focus-within:border-violet-600 outline-violet-600"
                  />
                </div>
                <div className="list_login_form flex items-center justify-between w-full">
                  <label htmlFor="Password" className="w-[35%]">
                    Password*
                  </label>
                  <div className="flex items-center border border- rounded-md p-1 w-[65%] focus-within:border-violet-600 bg-white"> {/* focus-within class added */}
                    <input
                      type={!visible ? "password" : "text"}
                      id="Password"
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Input password.."
                      className="outline-none w-full"
                    />
                    <div className="icon cursor-pointer ml-2" onClick={() => setVisible(!visible)}>
                      {!visible ? (
                        <FaEye className="text-gray-500" />
                      ) : (
                        <FaEyeSlash className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="bg-[#003B71] hover:bg-[#002B70] hover:font-bold rounded-md p-1 w-full text-white">Log in</button>
              </form>
            </div>
            {/* <div className=" absolute bottom-0 right-0 items-center">
        <Image
          className="dark:invert"
          src="/images/LOGO.svg"
          alt="Next.js logo"
          width={80}
          height={30}
          priority
        />
          <p className="text-white text-sm">Copyright &copy;2024 Perum Peruri  </p>
                  
        </div> */}

          </div>
        </div>
      </div>

      {/* <footer className="flex fixed gap-6 bottom-0 object-bottom flex-wrap items-center justify-center bg-slate-900 w-full min-h-[20%]">
        <div className="items-center gap-2 flex ">
          <p className="text-white">Copyright &#x24B8; 2024 Perum Peruri</p>
        </div>
      </footer> */}
    </div>
  );
}
