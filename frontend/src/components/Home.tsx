function Home() {
  return (
    <section className="bg-blue-100 h-screen pt-16">
      <div className="flex flex-col bg-color-200">
        <div className="flex items-center justify-center h-64 bg-red-300">
          <h2 className="text-2xl">block 1</h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-green-300">
          <h2 className="text-2xl">block 2</h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-orange-300">
          <h2 className="text-2xl">block 3</h2>
        </div>
      </div>
    </section>
  );
}

export default Home;
