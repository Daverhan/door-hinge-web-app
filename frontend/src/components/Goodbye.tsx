import { useState, useEffect } from "react";

function Goodbye() {
    const [data, setData] = useState({
        first_name: "",
    });

    useEffect(() => {
        fetch("/api/users/profile")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
            });
    }, []);

    return (
        <section className="bg-blue-100 h-screen pt-16">
            <div>
                {/*Mobile Login*/}
                <div
                // classNameName={`lg:hidden text-3xl fixed top-16 bottom-0 left-0 bg-blue-100 w-64 z-10 transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                //     }`}
                ></div>
                {/*Desktop Login*/}
                <div className="hidden lg:flex justify-center items-center">
                    <h5 className="text-4xl font-semibold">DoorHinge</h5>
                </div>
                <div className="flex justify-center py-1">
                    <p>Goodbye {data.first_name},</p>
                </div>
                <div className="flex justify-center py-1">
                    <p>We hope we were able to help you find your dream match!</p>
                </div>
                <div className="hidden lg:flex h-full w-full justify-center items-center">
                </div>
            </div>
        </section>
    );
};


export default Goodbye;