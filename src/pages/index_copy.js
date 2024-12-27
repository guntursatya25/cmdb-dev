import Image from "next/image";
import localFont from "next/font/local";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { setCookie } from 'cookies-next';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [email, setEmail] = useState("");

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
            const user = response.data.user.username;
            // localStorage.setItem(
            //   "idLogin",
            //   JSON.stringify(response.data.data._id)
            // );
            console.log(response,"responses")
            // localStorage.setItem("role", JSON.stringify(role));
            setCookie('access_token', token, {
              // maxAge: 60 * 60 * 24 * 7, // Token disimpan selama 7 hari
              // path: '/', // Optional: Sesuaikan path jika diperlukan
            })
            console.log(response, "response");
        console.log(token, "access_token");
          }
        }
      );
    } catch (err) {
      setLoading(false);
      // setMsgValidation(err.response?.data?.error || "An error occurred");
    }
    // if (active === "lupa password") {
    //   const kirimEmail = {
    //     email: email,
    //   };

    //   try {
    //     await axios
    //       .post(`${process.env.base_url}/api/auth/forgot-password`, kirimEmail)
    //       .then((response) => {
    //         if (response.status === 200) {
    //           setLoading(false);
    //           Swal.fire({
    //             icon: "success",
    //             text: "Silahkan cek email untuk mereset password.",
    //           });
    //         }
    //       });
    //   } catch (err) {
    //     setLoading(false);
    //     console.log("resp", err);
    //     Swal.fire({
    //       icon: "error",
    //       text: "Maaf, terjadi kesalahan",
    //     });
    //   }
    // } else {
    //   try {
    //     await axios
    //       .post(`${process.env.base_url}/auth/login`, form, {
    //         headers: { "Content-Type": "application/json" },
    //       })
    //       .then((response) => {
    //         if (response.status === 200) {
    //           setLoading(false);
    //           const token = response.data.token;
    //           const role = response.data.data.role;
    //           // localStorage.setItem(
    //           //   "idLogin",
    //           //   JSON.stringify(response.data.data._id)
    //           // );
              
    //           // localStorage.setItem("role", JSON.stringify(role));
    //           setTokenCookie(token.slice(7));

    //         }
    //       });
    //   } catch (err) {
    //     setLoading(false);
    //     setMsgValidation(err.response?.data?.error || "An error occurred");
    //   }
    // }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center z-0 relative">
       <div className=" flex w-full z-1 items-center m-auto rounded-3xl absolute  overflow-hidden">
        <div className="w-[50%]">
        {/* <Image
          className="dark:invert w-full h-full object-cover blur-md"
          src="/images/gedung_peruri.jpg"
          alt="Next.js logo"
          width={1000}
          height={1000}
          priority
        /> */}
        </div>
        <div className="w-[50%]">
        <Image
          className="dark:invert w-full h-full object-cover"
          src="/images/gedung_peruri.jpg"
          alt="Next.js logo"
          width={1000}
          height={1000}
          priority
        />
        </div>
      </div>
      {/* <div className="opacity-80 bg-[linear-gradient(90deg,rgba(0,0,0,1)_30%,rgba(0,0,0,0.954152661064426)_58%,rgba(0,0,0,0.8331827731092436)_68%,rgba(0,0,0,0.5819502801120448)_75%)] absolute flex w-[85%] z-2 items-center m-auto h-[85vh] rounded-3xl overflow-hidden"> */}
      <div className=" bg-[linear-gradient(90deg,rgba(225,228,231,0.577468487394958)_32%,rgba(218,219,220,0.8211659663865546)_40%,rgba(185,197,203,0.9164040616246498)_51%,rgba(171,190,200,0.9416141456582633)_67%,rgba(164,195,210,0.7931547619047619)_76%,rgba(159,194,212,0.5858718487394958)_84%,rgba(159,194,212,0.41780462184873945)_88%,rgba(159,194,212,0.2665441176470589)_92%,rgba(159,194,212,0.2665441176470589)_92%,rgba(159,194,212,0.2665441176470589)_92%,rgba(159,194,212,0.2637429971988795)_92%)] absolute flex z-2 w-full h-screen items-center m-auto overflow-hidden">

      {/* <div className="w-[50%]">
        <Image
          className="dark:invert w-full h-full object-cover blur-lg"
          src="/images/gedung_peruri.jpg"
          alt="Next.js logo"
          width={1000}
          height={1000}
          priority
        />
        </div>
        <div className="w-[50%] opacity-100">
        <Image
          className="dark:invert w-full h-full object-cover "
          src="/images/gedung_peruri.jpg"
          alt="Next.js logo"
          width={1000}
          height={1000}
          priority
        />
        </div> */}
      </div>
     
      <div
        className={`${geistSans.variable} ${geistMono.variable} flex items-center z-4 absolute w-[75%] h-[78vh] gap-16 rounded-3xl font-[family-name:var(--font-geist-sans)]`}
      >
        {/* <Image
          className="dark:invert"
          src="/images/LOGO.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        <div >
        <h1 className="text-white text-3xl font-bold mb-8">Asset Management Platform</h1>
        {/* <p className="text-white mb-8">lorem</p> */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 row-start-2 items-start sm:items-start  w-11/12 min-h-[80%] rounded-3xl">
          <div className="flex items-center justify-between w-full gap-[10%]">
            <label className="text-white" htmlFor="Username">
              Username*
            </label>
            <input
              type="text"
              id="Username"
              value={form.username}
              name="username"
              placeholder="Input username.."
              onChange={handleChange}
              className="border rounded-md w-full p-1 focus-within:border-violet-600 outline-violet-600"
            />
          </div>
          <div className="list_login_form flex items-center justify-between w-full gap-[10%]">
            <label className="text-white" htmlFor="Password">
              Password*
            </label>
            <div className="flex items-center border  border-double rounded-md p-1 w-full focus-within:border-violet-600 bg-white"> {/* focus-within class added */}
              <input
                type={!visible ? "password" : "text"}
                id="Password"
                name="password"
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

          <button type="submit" className="bg-violet-600 hover:bg-violet-800 hover:font-bold rounded-md p-1 w-full text-white">Submit</button>
        </form>
        </div>
        <div className=" absolute bottom-0 right-0 items-center">
        <Image
          className="dark:invert"
          src="/images/LOGO.svg"
          alt="Next.js logo"
          width={80}
          height={30}
          priority
        />
          <p className="text-white text-sm">Copyright &copy;2024 Perum Peruri  </p>
                  
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
