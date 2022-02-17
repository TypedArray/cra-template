import logo from './logo.svg';

function App() {
  return (
    <div className="text-center">
      <header className="bg-gray-600 min-h-screen flex flex-col items-center justify-center text-lg text-white">
        <img
          src={logo}
          className="h-[40vmin] motion-safe:animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="text-sky-300 hover:text-sky-600"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
