import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const formRef = useRef<HTMLFormElement>(null);
  const [emptyInputFlag, setEmptyInputFlag] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) {
      return;
    }

    e.preventDefault();

    const formData = new FormData(formRef.current);

    const formValues = {
      name: formData.get("name"),
      desc: formData.get("desc"),
      price: formData.get("price"),
      sqft: formData.get("sqft"),
      num_beds: formData.get("beds"),
      num_baths: formData.get("baths"),
      house_num: formData.get("house-num"),
      street_name: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip_code: formData.get("zip-code"),
    };

    let emptyInputFields = Object.values(formValues).some((value) => !value);

    if (emptyInputFields) {
      setEmptyInputFlag(true);
      return;
    }

    const createListing = async () => {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        setEmptyInputFlag(false);
        return;
      } else {
        navigate("/home");
      }
    };

    createListing();
  };

  return (
    <section className="h-screen pt-16 bg-blue-100">
      <h1 className="text-2xl text-center mt-1 mb-2">Create a Listing</h1>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col items-center ml-2"
      >
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="name" className="mr-2">
            Name:
          </label>
          <input id="name" name="name" autoComplete="name"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="desc" className="mr-2">
            Description:
          </label>
          <textarea id="desc" name="desc" autoComplete="desc"></textarea>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="price" className="mr-2">
            Price:
          </label>
          <input id="price" name="price" autoComplete="price"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="sqft" className="mr-2">
            SqFt:
          </label>
          <input id="sqft" name="sqft" autoComplete="sqft"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="beds" className="mr-2">
            Beds:
          </label>
          <input id="beds" name="beds" autoComplete="beds"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="baths" className="mr-2">
            Baths:
          </label>
          <input id="baths" name="baths" autoComplete="baths"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="house-num" className="mr-2">
            House #:
          </label>
          <input
            id="house-num"
            name="house-num"
            autoComplete="house-num"
          ></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="street" className="mr-2">
            Street:
          </label>
          <input id="street" name="street" autoComplete="street"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="city" className="mr-2">
            City:
          </label>
          <input id="city" name="city" autoComplete="city"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="state" className="mr-2">
            State:
          </label>
          <input id="state" name="state" autoComplete="state"></input>
        </div>
        <div className="mb-1 grid grid-cols-[30%_70%]">
          <label htmlFor="zip-code" className="mr-2">
            Zip Code:
          </label>
          <input id="zip-code" name="zip-code" autoComplete="zip-code"></input>
        </div>
        <div className="flex justify-center mr-2">
          <button className="mt-2 justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-44">
            Create Listing
          </button>
        </div>
        {emptyInputFlag ? (
          <p className="mt-1 text-2xl text-center mb-2 text-red-500">
            Input fields cannot be empty
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default CreateListing;
