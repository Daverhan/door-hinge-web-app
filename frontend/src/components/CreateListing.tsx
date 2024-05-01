import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const formRef = useRef<HTMLFormElement>(null);
  const [emptyInputFlag, setEmptyInputFlag] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const navigate = useNavigate();

  const handleFileUploads = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...e.target.files]);
    }
  };

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
      num_beds: formData.get("num_beds"),
      num_baths: formData.get("num_baths"),
      house_num: formData.get("house_num"),
      street_name: formData.get("street_name"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip_code: formData.get("zip_code"),
    };

    let emptyInputFields = Object.values(formValues).some((value) => !value);

    if (emptyInputFields) {
      setEmptyInputFlag(true);
      return;
    }

    files.forEach((file) => {
      formData.append("images", file);
    });

    const createListing = async () => {
      const response = await fetch("/api/listings", {
        method: "POST",
        body: formData,
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
    <section className="h-screen pt-8 bg-blue-100">
    <div className="min-h-fit pt-12 flex flex-col justify-center items-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full lg:max-w-lg md:max-w-lg max-w-screen py-3 px-5 bg-gray-100 lg:rounded md:rounded"
      >
      <h1 className="font-semibold text-2xl text-center mt-1 mb-2">Create a Listing</h1>
        <div className="mb-1 px-4 md:px-16 grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="name" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Name
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name" name="name" autoComplete="name"></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="desc" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Description
          </label>
          <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="desc" name="desc" autoComplete="desc"></textarea>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="price" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Price
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="price" name="price" autoComplete="price"></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="sqft" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            SqFt
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="sqft" name="sqft" autoComplete="sqft"></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="num_beds" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Beds
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="num_beds" name="num_beds" autoComplete="num_beds"></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="num_baths" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Baths
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="num_baths"
            name="num_baths"
            autoComplete="num_baths"
          ></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="house_num" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            House #
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="house_num"
            name="house_num"
            autoComplete="house_num"
          ></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="street_name" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Street
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="street_name"
            name="street_name"
            autoComplete="street_name"
          ></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="city" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            City
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="city" name="city" autoComplete="city"></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="state" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            State
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="state" name="state" autoComplete="state"></input>
        </div>
        <div className="mb-1 px-4 md:px-16  grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label htmlFor="zip_code" className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold">
            Zip Code
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="zip_code" name="zip_code" autoComplete="zip_code"></input>
        </div>
        <div className="mb-1 px-4 md:px-16 grid grid-cols-[25%_75%] md:grid-cols-[25%_75%] lg:grid-cols-[25%_75%] w-full">
          <label className="block uppercase text-end mr-2 tracking-wide text-gray-700 text-xs font-bold mt-0.5">Images: </label>
          <input
            onChange={handleFileUploads}
            id="file-uploads"
            name="file-uploads"
            type="file"
            multiple
          ></input>
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
      </div>
    </section>
  );
}

export default CreateListing;
