import { PiRobotThin } from "react-icons/pi";
import googleImage from './../assets/images/google.png';
import { useEffect, useState } from "react";

const Login = () => {
    const [countries, setCountries] = useState([]);

    async function loadCountries() {
        try {
          const response = await fetch('https://restcountries.com/v3.1/all');
          const countries = await response.json();
      
          // Sort countries alphabetically by name.common
          const sortedCountries = countries.sort((a: any, b: any) => 
            a.name.common.localeCompare(b.name.common)
          );
      
          // Set the sorted countries in state
          setCountries(sortedCountries);
          console.log(sortedCountries);
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      }


      useEffect(() => {
        loadCountries();
      }, []);
    return (
        <div className="flex flex-col w-screen h-screen bg-black bg-opacity-30">
            <form action="" className="flex flex-col w-full md:w-2/4 lg:w-1/3 bg-gray-50 rounded-3xl bg-opacity-90 justify-center items-center p-6 m-auto">
                <div className="flex flex-row">
                    <PiRobotThin className="text-5xl"></PiRobotThin>
                    <h3 className="font-light text-black text-5xl logo-text">Clark</h3>
                </div>

                <div className="p-5 border border-gray-500 rounded-3xl bg-transparent flex flex-row cursor-pointer hover:bg-gray-200 text-2xl gap-x-3 mt-10">
                    <img src={googleImage} alt="" className="w-10 h-10 object-contain" />
                    Continue with google
                </div>

                <h3 className="text-black text-3xl text-center my-5">OR</h3>
                <div className="flex flex-col w-full md:w-11/12 gap-y-5">
                    <input type="email" className="p-4 w-full border border-black rounded-2xl" placeholder="Email..." required />
                    <input type="password" className="p-4 w-full border border-black rounded-2xl" placeholder="Password..." required />

                    <button type="submit" className="w-full bg-blue-600 text-white cursor-pointer rounded-3xl h-12 mt-10">Submit</button>
                </div>
            </form>
        </div>
    )
}


export default Login;